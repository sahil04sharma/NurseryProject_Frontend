import React from "react";
import Shimmer from "./Shimmer";

const ReviewSkeleton = () => {
  return (
    <section className="bg-[#FBFAF9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="gideon-roman text-2xl sm:text-3xl font-semibold text-gray-700">
            Latest Reviews
          </h2>
          <p className="gideon-roman text-xl sm:text-2xl text-gray-600">
            What our customers say
          </p>
        </div>

        {/* SHIMMER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 p-5 bg-white min-h-50"
            >
              <Shimmer className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
              <Shimmer className="h-3 bg-gray-200 rounded w-1/3 mb-4" />
              <Shimmer className="h-3 bg-gray-200 rounded w-full mb-2" />
              <Shimmer className="h-3 bg-gray-200 rounded w-5/6 mb-2" />
              <Shimmer className="h-3 bg-gray-200 rounded w-4/6" />
            </div>
          ))}
        </div>
      </div>
      {/* Add Review Button */}
      <div className="w-full flex justify-center items-center">
        <Shimmer className="w-38 h-12 rounded-md mt-4 mb-6" />
      </div>
    </section>
  );
};

export default ReviewSkeleton;
