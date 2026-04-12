import React from "react";
import Shimmer from "./Shimmer";

export default function ProductCardSkeleton() {
  return (
    <div className="shrink-0 w-[46%] sm:w-1/3 md:w-1/4 lg:w-1/4 rounded-lg p-2">
      {/* Image Section */}
      <div className="relative mb-3 sm:mb-4">
        {/* Image */}
        <Shimmer className="aspect-square w-full rounded-lg" />
      </div>

      {/* Content */}
      <div className="sm:space-y-1 px-0.5 sm:px-1 pb-2 min-w-0">
        {/* Title + Category */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <Shimmer className="h-4 sm:h-5 w-3/5 rounded" />
          <Shimmer className="h-4 w-16 rounded-full" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-1">
          <Shimmer className="h-3 w-20 rounded" />
          <Shimmer className="h-3 w-6 rounded" />
        </div>

        {/* Description */}
        <Shimmer className="h-3 w-full rounded mb-1" />
        <Shimmer className="h-3 w-2/3 rounded mb-2" />

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <Shimmer className="h-4 w-16 rounded" />
          <Shimmer className="h-3 w-12 rounded" />
        </div>

        {/* Button */}
        <Shimmer className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}
