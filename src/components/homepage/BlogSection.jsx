import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import backend from "../../network/backend";
import { useAuth } from "../../ContextApi/AuthContext";
import BlogSectionSkeleton from "../Skeletons/BlogSectionSkeleton";

const BlogSection = () => {
  const [post, setPosts] = useState([]);
  const { error, setError } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await backend.cachedGet("/blog/get", {
          signal: controller.signal,
          staleTime: 60000,
          cacheTime: 300000,
        });

        const items =
          res?.data?.results ??
          res?.data?.items ??
          res?.data?.blogs ??
          res?.data?.data ??
          (Array.isArray(res?.data) ? res.data : []);

        const arr = Array.isArray(items) ? items : [];

        const sorted = [...arr].sort((a, b) => {
          const da = new Date(a?.publishedAt || a?.createdAt || 0).getTime();
          const db = new Date(b?.publishedAt || b?.createdAt || 0).getTime();
          return db - da;
        });

        setPosts(sorted.slice(0, 6));
      } catch (err) {
        if (err?.name !== "AbortError" && err?.name !== "CanceledError") {
          setError(err?.response?.data?.message || "Failed to load blogs.");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const slides = useMemo(() => {
    return (post || []).map((item) => {
      const {
        _id,
        slug,
        title,
        bannerImage,
        banner,
        coverImg,
        thumbnail,
        tags,
        categories,
        createdAt,
        publishedAt,
        excerpt,
        description,
        content,
        author,
        images,
      } = item || {};

      const image =
        bannerImage ||
        thumbnail ||
        coverImg ||
        banner ||
        (Array.isArray(images) ? images[0] : null) ||
        "https://images.unsplash.com/photo-1529651737248-dad5e287768e?w=900&q=80&auto=format&fit=crop";

      return {
        id: _id,
        title,
        image,
        preview: excerpt || description || content?.slice(0, 120) + "...",
        tags: tags || categories || [],
        authorName: author?.name || "Unknown",
        dateText: new Date(publishedAt || createdAt).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        ),
        to: `/blogs/${slug || _id}`,
      };
    });
  }, [post]);

  const paginate = (newDirection) => {
    if (!slides.length) return;
    const next = (current + newDirection + slides.length) % slides.length;
    setCurrent(next);
    setPage(([p]) => [p + newDirection, newDirection]);
  };

  const handleNext = () => {
    if (isAnimating) return;
    paginate(1);
  };

  const handleDragEnd = (_, info) => {
    const minOffset = 40;
    const minVelocity = 250;

    const { offset, velocity } = info;
    const xOffset = offset.x;
    const xVelocity = velocity.x;

    if (xOffset < -minOffset || xVelocity < -minVelocity) paginate(1);
    else if (xOffset > minOffset || xVelocity > minVelocity) paginate(-1);
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 1000 : -1000, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 1000 : -1000, opacity: 0 }),
  };

  if (loading) return <BlogSectionSkeleton />;
  if (error || !slides) return null;

  return (
    <>
      <section className="bg-[#1a4122] h-full lg:h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
        <div className="w-full max-w-6xl md:max-w-7xl mx-auto relative">
          {/* NEXT BUTTON */}
          <div className="pointer-events-auto absolute right-4 sm:right-6 md:right-8 bottom-102 sm:bottom-8 lg:bottom-6  z-20">
            <button
              onClick={handleNext}
              className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors group cursor-pointer"
            >
              <p className="text-body uppercase tracking-wider">Next</p>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white flex items-center justify-center group-hover:bg-white group-hover:text-[#1B4332] transition-all">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </button>
          </div>

          {/* SLIDER */}
          <div className="relative z-10">
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 220, damping: 28 },
                  opacity: { duration: 0.2 },
                }}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                dragTransition={{ power: 0.25, timeConstant: 280 }}
                dragMomentum={true}
                onDragEnd={handleDragEnd}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center cursor-grab active:cursor-grabbing select-none"
                style={{ touchAction: "pan-y" }}
              >
                {/* IMAGE */}
                <div className="order-1">
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-xl w-full h-[60vh] lg:h-[80vh]">
                    <img
                      src={slides[current]?.image}
                      alt={slides[current]?.title}
                      className="w-full h-full object-cover rounded pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="order-1 lg:order-2 text-white">
                  <h2
                    className="overflow-hidden text-xl sm:text-3xl md:text-4xl lg:text-5xl roboto-serif mb-4 sm:mb-6 md:mb-6 leading-tight text-center lg:text-left"
                    style={{
                      lineHeight: 1.05,
                    }}
                  >
                    {slides[current]?.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-200 justify-center lg:justify-start mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{slides[current]?.dateText}</span>
                    </div>

                    {!!slides[current]?.tags?.length && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[220px]">
                          {slides[current]?.tags?.slice(0, 3).join(", ")}
                          {slides[current]?.tags?.length > 3 ? "…" : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-body leading-relaxed mb-5 sm:mb-6 text-gray-200 text-center lg:text-left line-clamp-5">
                    {slides[current]?.preview}
                  </p>

                  <div className="flex justify-center lg:justify-start mb-3">
                    <Link
                      to={slides[current]?.to || "#"}
                      className="inline-flex items-center gap-2 text-body text-white hover:text-gray-300 underline-offset-4 hover:underline"
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* DOTS */}
          <div className="flex justify-center lg:justify-start mt-8 z-20 relative">
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    index === current
                      ? "bg-white w-8"
                      : "bg-gray-400 hover:bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center my-10">
        <button
          onClick={() => navigate("/blogs")}
          className="border border-gray-500 text-gray-900 px-8 py-2 rounded-md hover:border-gray-800 hover:text-gray-700 transition-colors font-medium cursor-pointer"
        >
          View All Posts
        </button>
      </div>
    </>
  );
};

export default BlogSection;
