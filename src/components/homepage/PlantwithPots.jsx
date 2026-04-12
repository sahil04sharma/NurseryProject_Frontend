// src/pages/AdminFilteredPlants.jsx
import React, { useEffect, useState, useCallback, useRef, useLayoutEffect, useMemo } from "react";
import { AlertCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import backend from "../../network/backend.js";
import { ProductCard, ProductSkeleton } from "../products";

/* ------------------------- Custom Hooks ------------------------- */
function useFilteredPlants(filter) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchFiltered = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await backend.get("/admin/plant/filter", { params: filter, withCredentials: true });
        const list = res?.data?.results ?? res?.data?.items ?? res?.data?.plants ?? [];
        if (mounted) setItems(Array.isArray(list) ? list : []);
      } catch (err) {
        if (!mounted) return;
        const msg = err?.response?.data?.message || err?.message || "Failed to load filtered plants.";
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFiltered();
    return () => { mounted = false; };
  }, [filter]);

  return { items, loading, error };
}

function useDragScroll(gridRef) {
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const onMouseDown = useCallback((e) => {
    if (!gridRef.current) return;
    isDraggingRef.current = true;
    gridRef.current.classList.add("cursor-grabbing");
    const pageX = e.pageX ?? e.touches?.[0]?.pageX;
    startXRef.current = (pageX || 0) - gridRef.current.offsetLeft;
    scrollLeftRef.current = gridRef.current.scrollLeft;
  }, [gridRef]);

  const onMouseUpOrLeave = useCallback(() => {
    isDraggingRef.current = false;
    gridRef.current?.classList.remove("cursor-grabbing");
  }, [gridRef]);

  const onMouseMove = useCallback((e) => {
    if (!isDraggingRef.current || !gridRef.current) return;
    const pageX = e.pageX ?? e.touches?.[0]?.pageX;
    if (pageX == null) return;
    e.preventDefault();
    const walk = (pageX - gridRef.current.offsetLeft - startXRef.current) * 1.5;
    gridRef.current.scrollLeft = scrollLeftRef.current - walk;
  }, [gridRef]);

  return { onMouseDown, onMouseUpOrLeave, onMouseMove };
}

function useChevronTop(gridRef) {
  const [chevronTop, setChevronTop] = useState("50%");

  const measureChevronTop = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const firstImageBox = grid.querySelector(".aspect-square");
    if (!firstImageBox) {
      setChevronTop("50%");
      return;
    }
    const gridRect = grid.getBoundingClientRect();
    const imgRect = firstImageBox.getBoundingClientRect();
    const centerY = imgRect.top + imgRect.height / 2;
    setChevronTop(`${Math.round(centerY - gridRect.top)}px`);
  }, [gridRef]);

  useLayoutEffect(() => {
    measureChevronTop();
    const ro = new ResizeObserver(() => measureChevronTop());
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener("resize", measureChevronTop);
    return () => { ro.disconnect(); window.removeEventListener("resize", measureChevronTop); };
  }, [measureChevronTop]);

  return chevronTop;
}

/* ------------------------- Utilities ------------------------- */
const getSkeletons = Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />);

export default function AdminFilteredPlants() {
  const gridRef = useRef(null);
  const defaultFilter = useMemo(() => ({ page: 1, limit: 10 }), []);
  const { items, loading, error } = useFilteredPlants(defaultFilter);
  const { onMouseDown, onMouseUpOrLeave, onMouseMove } = useDragScroll(gridRef);
  const chevronTop = useChevronTop(gridRef);

  // Sort items by ID
  const sorted = useMemo(() => [...items].sort((a, b) => String(a._id || a.id || "").localeCompare(String(b._id || b.id || ""))), [items]);

  const scrollByOneCard = useCallback((dir = 1) => {
    if (!gridRef.current) return;
    const firstCard = gridRef.current.firstElementChild;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 300;
    const gap = 16;
    gridRef.current.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
  }, []);

  const getProductDisplayMemo = useCallback((p) => {
  const { availableSizes, plantInfo, potDetails, defaultPrice } = p;
  const potList = availableSizes?.potsList;
  const image = potList?.availableColors?.[0]?.imageWithPlant ?? "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop";
  const price = potList?.priceWithPot ?? defaultPrice ?? "N/A";
  const originalPrice = potList?.offerPrice ?? null;

  // === CHANGED: prefer pot name, fallback to plant name ===
  const name =
    potDetails?.name?.trim() ||
    plantInfo?.name?.trim() ||
    "Unnamed Plant";

  const category = plantInfo?.subCategory?.join(", ") || "Uncategorized";
  const stock = 1;
  const rating = 4.5;
  const hasPot = !!potDetails;
  const description = hasPot ? "Plant with Pot" : "High-quality plant for your space.";
  return { image, price, originalPrice, name, category, stock, rating, description, hasPot };
}, []);


  const renderStarsMemo = useCallback((rating = 4.5) => {
    const max = 5;
    const full = Math.floor(rating);
    const frac = Math.max(0, Math.min(1, rating - full));
    const stars = [];
    for (let i = 0; i < max; i++) {
      if (i < full) stars.push(<Star key={`star-full-${i}`} className="w-4 h-4" color="#E8672F" fill="#E8672F" strokeWidth={1} />);
      else if (i === full && frac > 0)
        stars.push(
          <div key={`star-frac-${i}`} className="relative w-4 h-4">
            <Star className="w-4 h-4 absolute inset-0" color="#9CA3AF" fill="#ffffff" strokeWidth={1} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${frac * 100}%` }}>
              <Star className="w-4 h-4" color="#E8672F" fill="#E8672F" strokeWidth={1} />
            </div>
          </div>
        );
      else stars.push(<Star key={`star-empty-${i}`} className="w-4 h-4" color="#9CA3AF" fill="#D1D5DB" strokeWidth={1} />);
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  }, []);

  const productCards = useMemo(() => {
    return sorted.map((p) => {
      const display = getProductDisplayMemo(p);
      return <ProductCard key={p._id || p.id} product={p} type="plant" {...display} renderStars={renderStarsMemo} />;
    });
  }, [sorted, getProductDisplayMemo, renderStarsMemo]);

  return (
    <div className="w-full py-8 bg-[#FBFAF9]">
      <div className="mx-4 sm:mx-6 md:mx-12 lg:mx-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h4 className="heading-4 mb-2 text-gray-900 sm:text-3xl">
            Elegant Plants with Stylish Pots
          </h4>
          <p className="text-gray-600 text-body">
            Explore our curated selection of plants paired with beautiful pots to enhance your living space.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="text-red-800 text-body">Error loading plants</p>
              <p className="text-red-600 text-body">{error}</p>
              <button onClick={() => window.location.reload()} className="text-red-700 underline text-sm mt-1 hover:text-red-900">Retry</button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="relative">
          {!loading && sorted.length > 0 && <ScrollButton direction="left" onClick={() => scrollByOneCard(-1)} top={chevronTop} />}
          <div
            ref={gridRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseUpOrLeave}
            onMouseUp={onMouseUpOrLeave}
            onMouseMove={onMouseMove}
            onTouchStart={onMouseDown}
            onTouchMove={onMouseMove}
            onTouchEnd={onMouseUpOrLeave}
            className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto overflow-y-hidden pe-6 sm:pe-8 lg:pe-12 cursor-grab select-none"
            style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
          >
            {loading ? getSkeletons : productCards}
          </div>
          {!loading && sorted.length > 0 && <ScrollButton direction="right" onClick={() => scrollByOneCard(1)} top={chevronTop} />}
        </div>

        {/* Empty */}
        {!loading && !error && sorted.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-body">No results for current filter.</p>
          </div>
        )}

        {/* View All Button */}
        {!loading && sorted.length > 0 && (
          <div className="text-center mt-8">
            <Link to="/admin/plants">
              <button className="border border-gray-500 text-gray-600 px-8 py-2 rounded-md hover:border-gray-800 hover:text-gray-800 transition-colors duration-200 font-medium">
                View All Plants With Pots
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------- Scroll Button ------------------------- */
const ScrollButton = ({ direction = "left", onClick, top }) => (
  <button
    type="button"
    aria-label={`Scroll ${direction}`}
    onClick={onClick}
    className="flex items-center justify-center absolute z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/90 shadow ring-1 ring-black/5 hover:bg-white transition"
    style={{ [direction === "left" ? "left" : "right"]: 0, top, transform: "translateY(-50%)" }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
    </svg>
  </button>
);
