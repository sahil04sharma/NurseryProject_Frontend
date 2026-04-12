import React from "react";

const BlogSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 p-4 bg-white">
      <div className="w-full h-40 bg-gray-200 rounded-lg mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
    </div>
  );
};

export default BlogSkeleton;
