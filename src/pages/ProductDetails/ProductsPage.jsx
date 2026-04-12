import { useEffect, useMemo, useRef, useState } from "react";
import SidebarCategoriesWithSubs from "../../components/ViewAllItem/Sidebar";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import useProductsFetch from "../../hooks/useProductfetch";
import useProductFilters from "../../hooks/useProductFilter";
import { slugify, deslugify } from "../../utils/Slugify";
import ProductSkeleton from "../../components/products/ProductSkeleton";

import {
  defaultGetProductDisplay,
  defaultRenderStars,
} from "../../utils/productDisplay";
import { ProductCard } from "../../components/products";
import { useAuth } from "../../ContextApi/AuthContext";

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCategories, setSidebarCategories] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const urlSearch = params.get("search") || "";
  const urlCategory = params.get("category");
  const urlSub = params.get("sub");
  const categoryFromNavbar = Boolean(urlCategory);

  const { searchText } = useOutletContext();
  const finalSearchText =
    location.pathname === "/ViewAll-Item" ? urlSearch || searchText : "";

  const debounceSearchText = useDebounce(finalSearchText, 800);
  const isSearchActive = !!debounceSearchText?.trim();

  const scrollRef = useRef(null);
  const loaderRef = useRef(null);

  // 1. Initialize API Hook (The Single Source of Truth)
  const {
    products,
    totalCount,
    isFetching,
    hasMore,
    apiSuccess,
    reset,
    setSearchQuery,
    updateFilters, // ✅ Use this to sync UI filters to API
  } = useProductsFetch({
    limit: 12,
    scrollRef,
    loaderRef,
    initialSearchQuery: "",
  });

  // 2. Initialize UI Filter State
  // We pass a no-op function for setProducts because the Fetch hook handles data now.
  const filters = useProductFilters({ setProducts: () => {} });

  //  Whenever the user selects a category/price in the Sidebar,
  //  we tell useProductsFetch to update.

  useEffect(() => {
    //  Check if we have active filters
    const hasCategory = !!filters.selectedCategory?.name;
    const hasSubs = filters.selectedSubNames?.length > 0;
    const hasPrice = !!filters.priceFilter?.range;

    const payload = {
      category: hasCategory ? filters.selectedCategory.name : null,
      subCategory: hasSubs ? filters.selectedSubNames : [],
      price: hasPrice ? filters.priceFilter.range : null,
    };

    //  Send to API Hook
    updateFilters(payload);

    // If filtering, clear the search bar to avoid 0 results
    // if (hasCategory || hasSubs || hasPrice) {
    //   setSearchQuery("");
    // }

    if (hasCategory || hasSubs || hasPrice) {
      // Clear API search
      setSearchQuery("");

      // Remove search param from URL
      const newParams = new URLSearchParams(location.search);
      newParams.delete("search");

      navigate(
        {
          pathname: "/ViewAll-Item",
          search: newParams.toString(),
        },
        { replace: true }
      );
    }
  }, [
    filters.selectedCategory,
    filters.selectedSubNames,
    filters.priceFilter,
    updateFilters,
    setSearchQuery,
  ]);

  useEffect(() => {
    const trimmed = debounceSearchText?.trim();

    if (trimmed) {
      setSearchQuery(trimmed);
    } else {
      // Remove search mode
      setSearchQuery("");
    }
  }, [debounceSearchText]);

  useEffect(() => {
    if (!sidebarCategories.length) return;

    // CATEGORY
    if (urlCategory) {
      const matchedCategory = sidebarCategories.find(
        (cat) => cat.toLowerCase() === urlCategory.toLowerCase()
      );

      if (matchedCategory) {
        filters.handleSelectCategory({ name: matchedCategory });
      }
    }

    // SUBCATEGORY FIX (slug → real name)
    if (urlCategory && urlSub) {
      const readableSub = deslugify(urlSub);

      filters.handleSelectSubCategory(
        { names: [readableSub] },
        { name: decodeURIComponent(urlCategory) }
      );
    }
  }, [urlCategory, urlSub, sidebarCategories]);

  //  Cleanup & UI Logic
  useEffect(() => {
    return () => {
      // Clear filters from storage on unmount
      ["selectedCategory", "selectedSubNames", "priceFilter"].forEach((key) =>
        localStorage.removeItem(key)
      );
    };
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const safeUrlCategory = urlCategory?.toLowerCase?.() || "";
  const isRouteCategoryMissing =
    safeUrlCategory &&
    sidebarCategories.length > 0 &&
    !sidebarCategories.some((cat) => cat?.toLowerCase?.() === safeUrlCategory);

  const safeUrlSub = urlSub ? deslugify(urlSub).toLowerCase() : "";

  const isRouteSubMissing =
    urlCategory &&
    urlSub &&
    sidebarCategories.length > 0 &&
    !sidebarCategories.some(
      (cat) =>
        cat?.toLowerCase?.() === safeUrlCategory &&
        cat?.subs?.some((sub) => sub.toLowerCase() === safeUrlSub)
    );

  const shouldShowComingSoon = isRouteCategoryMissing || isRouteSubMissing;

  const displayProducts = useMemo(() => products || [], [products]);
  const hasProducts = displayProducts.length > 0;

  // Helpers for UI Chips
  const hasPrice = !!filters.priceFilter?.range;
  const hasCat = !!filters.selectedCategory?.name;
  const hasSub = filters.selectedSubNames?.length > 0;

  const handleClearAllSmart = () => {
  // 🔍 Decide whether to keep category
  const shouldPreserveCategory = categoryFromNavbar;

  const categoryToKeep = shouldPreserveCategory
    ? filters.selectedCategory?.name || urlCategory
    : null;

  // 🧹 Clear UI filters
  filters.removeSub();
  filters.removePrice();

  if (!shouldPreserveCategory) {
    filters.removeCat(); // ⬅️ IMPORTANT
  }

  // 🔄 Update API filters
  updateFilters({
    category: categoryToKeep,
    subCategory: [],
    price: null,
  });

  // 🔍 Clear search
  setSearchQuery("");

  // 🌐 Update URL
  const newParams = new URLSearchParams();
  if (categoryToKeep) {
    newParams.set("category", categoryToKeep);
  }

  navigate(
    {
      pathname: "/ViewAll-Item",
      search: newParams.toString(),
    },
    { replace: true }
  );
};


  const hasActiveCategoryOrSub =
    !!filters.selectedCategory?.name || filters.selectedSubNames?.length > 0;

  const showComingSoon =
    hasActiveCategoryOrSub && !isFetching && apiSuccess === false;

  return (
    <div className="min-h-screen w-full bg-[#FBFAF9] pt-24 sm:pt-4 md:pt-0">
      {/* FILTER HEADER & CHIPS */}
      <div className="px-3 sm:px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-[999] flex items-center gap-2 flex-wrap shadow-sm ">
        {/* <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-1 rounded-sm border bg-[#1a4122] text-white hover:text-white text-md px-6 py-2 hover:bg-[#0f2815]"
        >
          Filters
        </button> */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-1 rounded-sm border bg-[#1a4122] text-white px-6 py-2"
        >
          Filters
        </button>

        {/* {(hasPrice || hasCat || hasSub) && (
          <>
            {hasPrice && (
              <button
                type="button"
                onClick={filters.removePrice}
                className="inline-flex items-center gap-1 rounded-full border border-[#1a4122] text-[#1a4122] hover:text-white text-xs px-3 py-1 hover:bg-[#0f2815]"
              >
                ₹{filters.priceFilter.range.min} –
                {filters.priceFilter.range.max === Number.MAX_SAFE_INTEGER
                  ? "∞"
                  : `₹${filters.priceFilter.range.max}`}
                <span className="font-bold ml-1">×</span>
              </button>
            )}

            {hasCat && (
              <button
                type="button"
                onClick={filters.removeCat}
                className="inline-flex items-center gap-1 rounded-full border border-[#1a4122] text-[#1a4122] hover:text-white text-xs px-3 py-1 hover:bg-[#0f2815]"
              >
                {filters.selectedCategory?.name}
                <span className="font-bold ml-1">×</span>
              </button>
            )}

            {hasSub && (
              <button
                type="button"
                onClick={filters.removeSub}
                className="inline-flex items-center gap-1 rounded-full border border-[#1a4122] text-[#1a4122] hover:text-white text-xs px-3 py-1 hover:bg-[#0f2815]"
              >
                {filters.selectedSubNames.join(", ")}
                <span className="font-bold ml-1">×</span>
              </button>
            )}

            <button
              type="button"
              onClick={filters.clearAll}
              className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium ml-auto"
            >
              Clear All
            </button>
          </>
        )} */}

        {!isSearchActive && (hasPrice || hasCat || hasSub) && (
          <>
            {hasPrice && (
              <button
                type="button"
                onClick={filters.removePrice}
                className="inline-flex items-center gap-1 rounded-full border border-[#1a4122] text-[#1a4122] text-xs px-3 py-1"
              >
                ₹{filters.priceFilter.range.min} –{" "}
                {filters.priceFilter.range.max === Number.MAX_SAFE_INTEGER
                  ? "∞"
                  : `₹${filters.priceFilter.range.max}`}
                <span className="font-bold ml-1">×</span>
              </button>
            )}

            {hasCat && (
              <button
                type="button"
                onClick={filters.removeCat}
                className="inline-flex items-center gap-1 rounded-full border border-[#1a4122] text-[#1a4122] text-xs px-3 py-1"
              >
                {filters.selectedCategory?.name}
                <span className="font-bold ml-1">×</span>
              </button>
            )}

            {hasSub && (
              <button
                type="button"
                onClick={filters.removeSub}
                className="inline-flex items-center gap-1 rounded-full border border-[#1a4122] text-[#1a4122] text-xs px-3 py-1"
              >
                {filters.selectedSubNames.join(", ")}
                <span className="font-bold ml-1">×</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClearAllSmart}
              className="text-xs text-red-600 ml-auto"
            >
              Clear All
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row w-full">
        {/* SIDEBAR DRAWER */}
        <aside
          className={`
            fixed top-0 right-0 h-full w-90 bg-white shadow-xl 
            transform transition-transform duration-300
            z-9999 overflow-y-auto
            ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="h-full overflow-y-auto">
            <SidebarCategoriesWithSubs
              selectedCategory={filters.selectedCategory}
              selectedSubNames={filters.selectedSubNames}
              priceFilter={filters.priceFilter}
              onSelectCategory={filters.handleSelectCategory}
              onSelectSubCategory={filters.handleSelectSubCategory}
              onPriceFilterChange={filters.handlePriceFilter}
              onClearAll={filters.clearAll}
              openMobile={sidebarOpen}
              setOpenMobile={setSidebarOpen}
              className="h-full"
              onCategoriesLoaded={setSidebarCategories}
            />
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-9990"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN PRODUCT AREA */}
        <main
          ref={scrollRef}
          className="flex-1 min-w-0 bg-[#FBFAF9] overflow-y-auto "
        >
          <div ref={scrollRef} className="px-3 sm:px-4">
            {/* NO PRODUCTS STATE */}
            {!hasProducts && (
              <div className="py-8">
                {showComingSoon ? (
                  <>
                    <p className="text-lg font-semibold text-gray-700 text-center">
                      Coming Soon 🌱
                    </p>
                    <p className="text-gray-500 mt-1 text-center">
                      Products for{" "}
                      <span className="font-medium capitalize">
                        {filters.selectedSubNames?.[0] ||
                          filters.selectedCategory?.name}
                      </span>{" "}
                      will be available soon.
                    </p>
                  </>
                ) : (
                  //  Skeletons instead of spinner
                  <div className="[&>div]:w-full! [&>div]:shrink-auto! overflow-hidden grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <ProductSkeleton key={`initial-skeleton-${index}`} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PRODUCT GRID */}
            {hasProducts && (
              <>
                <div className="mb-3 mt-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
                  Showing <span className="font-semibold">{totalCount}</span>{" "}
                  product{totalCount !== 1 ? "s" : ""}
                </div>

                <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {displayProducts.map((product, index) => (
                    // Using compound key to ensure uniqueness if API sends duplicates
                    <div
                      key={`${product._id || product.id}-${index}`}
                      className="w-full"
                    >
                      <div className="[&>div]:w-full! [&>div]:shrink-auto! overflow-hidden">
                        <ProductCard
                          product={product}
                          type={product?.plantId ? "plant" : "item"}
                          getProductDisplay={defaultGetProductDisplay}
                          renderStars={defaultRenderStars}
                          onClearCategory={filters.removeCat}
                          onClearSubcategories={filters.removeSub}
                          onClearPrice={filters.removePrice}
                          onClearAll={handleClearAllSmart}
                          selectedCategory={filters.selectedCategory}
                          selectedSubNames={filters.selectedSubNames}
                          priceFilter={filters.priceFilter}
                        />
                      </div>
                    </div>
                  ))}

                  {/* LOADING SPINNER */}
                  {isFetching && hasMore && (
                    <div className="col-span-full flex justify-center py-4">
                      <div className="loader w-8 h-8 border-4 border-green-600 border-t-[#1a4122] rounded-full animate-spin"></div>
                    </div>
                  )}
                  {/* {isFetching && (
                    <>
                      <div className="[&>div]:w-full! [&>div]:shrink-auto! overflow-hidden ">
                        {Array.from({ length: 8 }).map((_, index) => (
                          <ProductSkeleton key={`skeleton-${index}`} />
                        ))}
                      </div>
                    </>
                  )} */}

                </div>
              </>
            )}

            {/* SCROLL TRIGGER */}
            <div ref={loaderRef} className="w-full h-1" />
          </div>
        </main>
      </div>
    </div>
  );
}
