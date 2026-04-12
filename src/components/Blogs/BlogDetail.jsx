import React, { useEffect, useState } from "react";
import api from "../../network/backend";
import { useAuth } from "../../ContextApi/AuthContext";
import PageLoader from "../Loader/PageLoader";
import { useParams, useNavigate } from "react-router-dom";


export default function TitleAboveHero() {
  const { slug } = useParams();
  const [blogData, setBlogData] = useState(null);
  const { loading, setLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blog/${slug}`);
        console.log(res.data.data);
        if (active && res?.data?.success) {
          setBlogData(res?.data?.data || null);
        }
      } catch (e) {
        console.log(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (!blogData) return null;

  // Collect recommended products from ALL sections
  const allSectionProducts = blogData.sections
    ?.map((sec) => sec.recommendedProducts || [])
    .flat()
    .filter((item) => item); 

  // If no recommended products in sections → fallback to first item of overallRecommendations
  const finalRecommendedProducts =
    allSectionProducts.length > 0
      ? allSectionProducts
      : blogData.overallRecommendations?.length > 0
      ? blogData.overallRecommendations
      : [];

  // safe fallback banner image
  const bannerSrc =
    blogData.bannerImage ||
    (blogData.sections?.[0]?.recommendedProducts?.[0]?.bannerImg?.[0] ?? "");

  return (
    <>
      {loading ? (
        <div className="h-screen md:h-1/2">
          <PageLoader />
        </div>
      ) : (
        <>
          <section className="section mx-2 pt-30 sm:pt-8 md:mx-20">
            <div className="section relative w-full rounded-lg h-[50vh] md:h-[70vh] max-h-[500px] overflow-hidden">
              {bannerSrc ? (
                <img
                  src={bannerSrc}
                  alt={blogData.title || "Blog Banner"}
                  className="absolute inset-0 w-full h-full object-cover md:object-cover"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-stone-200" />
              )}

              {/* Optional dark overlay for readability */}
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Optional centered title */}
              <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
                <h1 className="heading-4 text-white text-3xl md:text-5xl lg:text-6xl font-serif max-w-4xl md:max-w-2xl leading-tight drop-shadow-xl">
                  {blogData.mainCategory || blogData.title}
                </h1>
              </div>
            </div>

            {/* Hero Section with Text */}
            <div className="max-w-6xl text-left mt-10">
              <div className="w-full space-y-3 md:space-y-6">
                {/* Title above Main Category */}
                {blogData.title && (
                  <p className="text-left roboto-serif text-sm md:text-2xl tracking-wide uppercase text-stone-500 font-medium">
                    {blogData.title}
                  </p>
                )}

                {/* Main Category as Heading */}
                <h1 className="roboto-serif text-2xl md:text-3xl lg:text-4xl font-serif leading-tight text-stone-900">
                  {blogData.mainCategory || blogData.title || "Untitled"}
                </h1>

                {/* Description */}
                <div className="text-body text-stone-600 leading-relaxed  text-base md:text-lg">
                  {blogData.description ? (
                    <p>{blogData.description}</p>
                  ) : (
                    <p>No description available.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Services/Sections with Recommended Sidebar */}
          <section className="mx-2 md:mx-20 grid md:grid-cols-[2fr_1fr] pb-4">
            {/* LEFT — Services */}
            <div className="services-left">
              <div className="max-w-6xl pb-6 md:pb-16">
                <h2 className="text-left overflow-hidden heading-4 text-5xl md:text-6xl lg:text-7xl font-serif tracking-widest uppercase text-[#1A4122]">
                  SERVICES
                </h2>
              </div>

              {blogData.sections?.map((section, index) => {
                const displayNum = String(index + 1).padStart(2, "0");

                return (
                  <div key={index} className="max-w-4xl mb-4 md:mb-6 text-left">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-stone-300 lg:mb-6">
                      {displayNum}
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-3xl roboto-serif uppercase tracking-wider leading-tight text-stone-800 mb-4">
                      {section.subTitle}
                    </h3>

                    <p className="text-body text-stone-600 md:text-lg max-w-3xl">
                      {section.subDescription}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* RIGHT — Recommended Sidebar */}
            <div className="recommended-right sticky h-fit ml-auto">
              <h3 className="text-2xl md:text-xl font-serif text-[#1A4122] mb-6 uppercase tracking-widest">
                Recommended
              </h3>

              {finalRecommendedProducts.length === 0 && (
                <p className="text-stone-500">
                  No recommended products available.
                </p>
              )}

              <div className="space-y-6 grid grid-cols-2 gap-4 sm:grid-cols-1">
                {finalRecommendedProducts.map((product) => (
                  <div
                    onClick={() => navigate(`/product/item/${product?._id}`)}
                    key={product._id}
                    className=" rounded-lg  cursor-pointer"
                  >
                    <div className="w-full h-50 md:w-70 md:h-80 rounded-md overflow-hidden mb-1">
                      <img
                        src={product.bannerImg?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 duration-200"
                      />
                    </div>

                    
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
