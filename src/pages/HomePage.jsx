import React, { lazy, Suspense, useEffect, useState } from "react";
import Tree from "../components/homepage/Tree";
import FeatureBanner from "../components/homepage/FeatureBanner";
const AllProduct2 = lazy(() =>
  import("../components/homepage/Allproduct2.jsx")
);
const AllProduct = lazy(() => import("../components/homepage/Allproduct.jsx"));
const VideoBanner = lazy(() =>
  import("../components/homepage/VideoBanner.jsx")
);
import ErrorBoundary from "../components/ErrorBoundaries.jsx";
import LoginPromptModal from "../components/modal/LoginPromptModal.jsx";
const BlogSection = lazy(() =>
  import("../components/homepage/BlogSection.jsx")
);
const Reviews = lazy(() => import("../components/homepage/Reviews.jsx"));
import { useAuth } from "../ContextApi/AuthContext.jsx";
const PlantFeaturesSectionSkeleton = lazy(() =>
  import("../components/Skeletons/PlantFeaturesSectionSkeleton.jsx")
);
const AllProductSectionSkeleton = lazy(() =>
  import("../components/Skeletons/AllProductSectionSkeleton.jsx")
);
const VideoBannerSkeleton = lazy(() =>
  import("../components/Skeletons/VideoBannerSkeleton.jsx")
);
const BlogSectionSkeleton = lazy(() =>
  import("../components/Skeletons/BlogSectionSkeleton.jsx")
);
const ReviewSkeleton = lazy(() =>
  import("../components/Skeletons/ReviewSkeleton.jsx")
);

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  // show login modal
  useEffect(() => {
    if (user) return;

    const alreadyShown = sessionStorage.getItem("loginModalShown");
    if (alreadyShown) return;
    const timer = setTimeout(() => {
      setShowModal(true);
      sessionStorage.setItem("loginModalShown", "true");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section>
      <LoginPromptModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      <div className="home-image">
        <ErrorBoundary>
          <Tree />
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<PlantFeaturesSectionSkeleton />}>
            <FeatureBanner />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<AllProductSectionSkeleton />}>
            <AllProduct2 />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<AllProductSectionSkeleton />}>
            <AllProduct />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<VideoBannerSkeleton />}>
           {/* <VideoBanner /> */}
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<BlogSectionSkeleton />}>
            <BlogSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<ReviewSkeleton />}>
            <Reviews />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default HomePage;
