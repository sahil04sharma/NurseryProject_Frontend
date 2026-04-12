import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";
import OfferBannerSkeleton from "./OfferBannerSkeleton";
import Shimmer from "./Shimmer";

export default function AllProductSkeleton({ count = 6 }) {
  return (
    <div className="w-full py-8 bg-[#FBFAF9]">
      <div className="mx-4 sm:mx-6 md:mx-12 lg:mx-8">
        {/* Heading */}
        <div className="mb-6 sm:mb-8 text-center space-y-2">
          <div className="h-6 md:h-10 w-64 mx-auto bg-gray-200 rounded animate-pulse" />
          <div className="h-4 md:h-8 w-96 max-w-full mx-auto bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Carousel */}
        <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-hidden pe-6 sm:pe-8 lg:pe-12">
          {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
        <div>
          <div className="w-full flex justify-center items-center">
            <Shimmer className="w-66 h-14 rounded-md mt-6" />
          </div>
        </div>
      </div>
      <OfferBannerSkeleton />
    </div>
  );
}
