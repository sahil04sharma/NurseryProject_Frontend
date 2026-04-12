import React from "react";
import Shimmer from "./Shimmer";

export default function VideoBannerSkeleton() {
  return (
    <section className="relative py-6 min-h-screen px-5 bg-cover bg-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#CB6129]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <Shimmer className="h-8 sm:h-12 md:h-14 lg:h-16 w-3/4 mx-auto rounded-lg" />
          <Shimmer className="h-8 md:hidden mt-2 sm:h-12  w-2/4 mx-auto rounded-lg" />
        </div>

        {/* Video Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 mb-4 md:mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/60 rounded-xl overflow-hidden">
              <div className="relative pb-[150%]">
                <Shimmer className="absolute inset-0 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2 max-w-5xl mx-auto px-5 flex flex-col items-center">
          <Shimmer className="h-4 w-full rounded" />
          <Shimmer className="h-4 w-full rounded" />
          <Shimmer className="h-4 md:hidden w-full rounded" />
          <Shimmer className="h-4 md:hidden w-full rounded" />
          <Shimmer className="h-4 md:hidden w-full rounded" />
          <Shimmer className="h-4 w-[50%] rounded" />
         
        </div>
      </div>
    </section>
  );
}
