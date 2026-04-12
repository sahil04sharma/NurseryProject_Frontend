import React from "react";
import Shimmer from "./Shimmer";

export default function BlogSectionSkeleton() {
  return (
    <section className="bg-[#1a4122] min-h-screen lg:h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
      <div className="w-full max-w-6xl md:max-w-7xl mx-auto relative">
        {/* NEXT BUTTON PLACEHOLDER */}
        <div className="absolute right-4 sm:right-6 md:right-8 bottom-102 sm:bottom-8 lg:bottom-6 z-20">
          <Shimmer className="h-10 w-28 rounded-full" />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* IMAGE */}
          <div>
            <div className="bg-white/10 p-3 sm:p-4 rounded-lg shadow-xl w-full h-[60vh] lg:h-[80vh]">
              <Shimmer className="w-full h-full rounded-lg" />
            </div>
          </div>

          {/* CONTENT */}
          <div className="text-white space-y-4 sm:space-y-5">
            {/* Title */}
            <Shimmer className="h-8 sm:h-10 md:h-12 lg:h-14 w-4/5 rounded" />

            {/* Meta */}
            <div className="flex gap-4 justify-center lg:justify-start">
              <Shimmer className="h-4 w-28 rounded" />
              <Shimmer className="h-4 w-36 rounded" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Shimmer className="h-4 w-full rounded" />
              <Shimmer className="h-4 w-11/12 rounded" />
              <Shimmer className="h-4 w-10/12 rounded" />
              <Shimmer className="h-4 w-8/12 rounded" />
            </div>

            {/* CTA */}
            <Shimmer className="h-8 w-32 rounded my-8 mx-auto lg:mx-0" />
          </div>
        </div>

        {/* DOTS */}
        <div className="flex justify-center lg:justify-start mt-6">
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Shimmer key={i} className="h-2 w-2 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
