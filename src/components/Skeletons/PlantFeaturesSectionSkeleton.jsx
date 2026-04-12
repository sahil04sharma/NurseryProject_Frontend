import React from "react";
import OfferBannerSkeleton from "./OfferBannerSkeleton";
import Shimmer from "./Shimmer";

export default function PlantFeaturesSectionSkeleton() {
  return (
    <section>
      <div className="section lg:min-h-screen h-full flex items-center justify-center p-4">
        <div className="w-full md:max-w-7xl xl:max-w-352 2xl:max-w-384">
          {/* Heading Skeleton */}
          <div className="text-center mb-8 lg:mb-20 xl:mb-24 space-y-4">
            <Shimmer className="h-6 lg:h-10 w-56 lg:w-96 mx-auto" />
            <Shimmer className="h-4 w-72 md:w-[520px] mx-auto" />
          </div>

          {/* Features Grid */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 xl:gap-24 2xl:gap-32">
            {/* Left Column */}
            <div className="flex flex-col space-y-10 md:space-y-16 w-full md:flex-1 md:max-w-[300px]">
              {[1, 2].map((_, i) => (
                <div key={i} className="text-center md:text-left space-y-3">
                  <Shimmer className="w-12 h-12 lg:w-14 lg:h-14 mx-auto md:mx-0 rounded-lg" />
                  <Shimmer className="h-5 w-40 mx-auto md:mx-0" />
                  <Shimmer className="h-4 w-full" />
                </div>
              ))}
            </div>

            {/* Center Image Skeleton */}
            <Shimmer className="w-[280px] md:w-[300px] lg:w-[420px] 2xl:w-[480px] h-[360px] md:h-[380px] lg:h-screen rounded-t-full shrink-0" />

            {/* Right Column */}
            <div className="flex flex-col space-y-10 md:space-y-16 w-full md:flex-1 md:max-w-[300px]">
              {[1, 2].map((_, i) => (
                <div key={i} className="text-center md:text-left space-y-3">
                  <Shimmer className="w-12 h-12 lg:w-14 lg:h-14 mx-auto md:mx-0 rounded-lg" />
                  <Shimmer className="h-5 w-44 mx-auto md:mx-0" />
                  <Shimmer className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Offer Banner Skeleton */}
      <div className="px-4">
        <OfferBannerSkeleton />
      </div>
    </section>
  );
}
