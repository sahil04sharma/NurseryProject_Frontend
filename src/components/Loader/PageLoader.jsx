import React from "react";

const PageLoader = () => {
  return (
    <section className="h-full w-full flex items-center justify-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900 mx-auto mb-4"></div>
      </div>
    </section>
  );
};

export default PageLoader;
