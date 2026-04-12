import React from "react";
import Shimmer from "./Shimmer";

export default function OfferBannerSkeleton() {
  return (
    <div className="w-full px-4 md:px-6 lg:px-20">
      <aside className="relative w-full mx-auto rounded-xl overflow-hidden shadow-lg my-10">
        {/* Image Skeleton */}
        <Shimmer className="w-full h-72 md:h-96" />

        {/* Overlay Content Skeleton */}
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10 space-y-4">
          <Shimmer className="h-6 w-32 rounded-md" />
          <Shimmer className="h-8 md:h-12 w-3/4 rounded-md" />
          <Shimmer className="h-4 w-2/3 rounded-md" />
          <Shimmer className="h-10 w-32 rounded-lg mt-2" />
        </div>
      </aside>
    </div>
  );
}
