import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import backend from "../../network/backend";
import { useNavigate } from "react-router-dom";
import StarRating from "../common/StarRating";
import { useAuth } from "../../ContextApi/AuthContext";
import ReviewCard from "./ReviewCard";
import ReviewSkeleton from "../Skeletons/ReviewSkeleton";

export default function ReviewSection() {
  const [reviews, setReviews] = useState([]);
  const { loading, setLoading, error, setError } = useAuth();
  const [startIndex, setStartIndex] = useState(0);
  const intervalRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const navigate = useNavigate();

  // Lock scroll when modal opens
  useEffect(() => {
    if (selectedReview) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [selectedReview]);

  // Carousel state

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await backend.cachedGet("/review/approve-review", {
          signal: controller.signal,
          staleTime: 30000,
          cacheTime: 300000,
        });

        const payload = Array.isArray(res?.data?.data) ? res.data.data : [];

        const normalized = payload.map((r, i) => {
          const created = r?.createdAt || r?.updatedAt;
          const dateText = created
            ? new Date(created).toLocaleDateString()
            : "—";

          return {
            _id: r?._id || i + 1,
            title: `${r?.rating ?? 5} Star Review`,
            dateText,
            user: r?.user || {
              name: "Customer",
              image:
                "https://firebasestorage.googleapis.com/v0/b/learning-63a18.appspot.com/o/users%2F21bed273-2706-4708-a35b-7d9bd0b8140e-1733399052578.jpeg?alt=media&token=b235cc0c-d341-4216-9e33-e95bded48224",
            },
            rating: r?.rating ?? 5,
            description: r?.reviewText || "",
            image: r?.emotionImage || null,
          };
        });

        const sorted = [...normalized].sort((a, b) => {
          return (
            new Date(b.dateText).getTime() - new Date(a.dateText).getTime()
          );
        });

        setReviews(sorted);
      } catch (err) {
        if (err?.name !== "AbortError" && err?.name !== "CanceledError") {
          setError(
            err?.response?.data?.message ||
              "Failed to load reviews. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const visible = useMemo(() => {
    if (!reviews.length) return [];
    const out = [];
    for (let i = 0; i < 3; i++)
      out.push(reviews[(startIndex + i) % reviews.length]);
    return out;
  }, [reviews, startIndex]);

  useEffect(() => {
    if (!reviews.length || paused) return;
    intervalRef.current = setInterval(() => {
      setStartIndex((idx) => (idx + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [reviews.length, paused]);

  const itemVariants = (pos) => {
    const isCenter = pos === 1;
    return {
      initial: { opacity: 0, y: 10, scale: isCenter ? 0.98 : 0.96 },
      animate: {
        opacity: isCenter ? 1 : 0.7,
        y: isCenter ? -8 : 0,
        scale: isCenter ? 1.03 : 0.96,
        transition: { duration: 0.45, ease: "easeOut" },
      },
      exit: {
        opacity: 0,
        y: 10,
        scale: 0.95,
        transition: { duration: 0.25, ease: "easeIn" },
      },
    };
  };
  // if (loading) return <ReviewSkeleton />;
  if (error || visible.length === 0) return null;

  return (
    <>
      <section className="bg-[#FBFAF9] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-6 text-center">
            <h2 className="gideon-roman text-2xl sm:text-3xl  font-semibold text-gray-700">
              Latest Reviews
            </h2>
            <p className="gideon-roman text-xl sm:text-2xl text-gray-600">
              What our customers say
            </p>
          </div>

          {/* CAROUSEL */}
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch ">
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((review, i) => (
                  <motion.div
                    key={review._id}
                    variants={itemVariants(i)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout
                    onClick={() => setSelectedReview(review)}
                    className="relative will-change-transform overflow-visible pt-3 cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {i === 1 && (
                      <div className="absolute left-1/2 -translate-x-1/2 -top-1 z-20 h-1 w-20 rounded-full bg-[#1A4122] shadow-[0_0_8px_rgba(26,65,34,0.45)]" />
                    )}

                    <div className="relative z-10">
                      <ReviewCard review={review} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex justify-center my-10">
          <button
            onClick={() => navigate("/Add-review")}
            className="border border-gray-500 text-gray-900 px-8 py-2 rounded-md hover:border-gray-800 hover:text-gray-700 transition-colors font-medium cursor-pointer"
          >
            Add Review
          </button>
        </div>
      </section>

      {/*  MODAL */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10001 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReview(null)}
            style={{
              backgroundAttachment: "fixed",
            }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-md rounded-xl max-w-3xl w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedReview(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
              >
                ✕
              </button>

              {/* Left Image */}
              {selectedReview.image ? (
                <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedReview.image}
                    alt="Review"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              {/* Right Content */}
              <div className={selectedReview.image ? "" : "md:col-span-2"}>
                <h2 className="heading-4 text-lg font-semibold text-gray-900 mb-1">
                  {selectedReview.title}
                </h2>

                <p className="text-body text-sm text-gray-500 mb-3">
                  {selectedReview.dateText}
                </p>

                <StarRating rating={selectedReview.rating} />

                <p className="text-body text-gray-700 text-sm leading-relaxed mt-4 whitespace-pre-line">
                  {selectedReview.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
