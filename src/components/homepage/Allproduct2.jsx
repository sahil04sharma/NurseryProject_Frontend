import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import { Link } from "react-router-dom";
import backend from "../../network/backend.js";
import { ProductCard } from "../products/index.js";
import OfferBanner from "./OfferBanner.jsx";
import { useAuth } from "../../ContextApi/AuthContext.jsx";

export default function AllProduct2() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error, setError } = useAuth();

  const gridRef = useRef(null);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [chevronTop, setChevronTop] = useState("50%");

  // Fetch Products
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await backend.cachedGet("/item/get", {
          signal: controller.signal,
          staleTime: 30000,
          cacheTime: 300000,
        });
        setProducts(res?.data?.items || []);
      } catch (err) {
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          console.error("Product fetch error:", err);
          setError(
            err.response?.data?.message ||
              "Failed to load products. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  // Product Display Extractor
  const getProductDisplay = useCallback((p) => {
    const image =
      p?.bannerImg?.[0] ||
      p?.variants?.[0]?.variantImg ||
      p?.colorCategory?.[0]?.image ||
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop";

    const price = p?.variants?.[0]?.sellingPrice || p?.sellingPrice || "N/A";
    const originalPrice = p?.variants?.[0]?.offerPrice || p?.offerPrice || null;

    let description = "High-quality plant for your space.";
    try {
      const desc = p?.description?.[0];
      if (desc) {
        let parsed = desc;
        while (
          typeof parsed === "string" &&
          (parsed.startsWith("[") || parsed.startsWith("{"))
        ) {
          parsed = JSON.parse(parsed);
          if (Array.isArray(parsed)) parsed = parsed[0];
        }
        if (typeof parsed === "string" && parsed.trim() !== "")
          description = parsed;
      }
    } catch (e) {
      console.warn("Description parse error:", e);
    }

    return {
      image,
      price,
      originalPrice,
      description,
      stock: p?.variants?.[0]?.stock ?? p?.stock ?? 0,
      category: p?.category,
      name: p?.name || "Unnamed Plant",
    };
  }, []);

  // Stable Sorted Product List
  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) =>
        String(a?._id || a?.id || "").localeCompare(
          String(b?._id || b?.id || "")
        )
      ),
    [products]
  );

  // Scroll & Drag Handling
  const handleDrag = useCallback(
    (e) => {
      if (!isDragging || !gridRef.current) return;
      const pageX = e.pageX ?? e.touches?.[0]?.pageX;
      if (!pageX) return;
      e.preventDefault();
      const x = pageX - gridRef.current.offsetLeft;
      gridRef.current.scrollLeft =
        scrollLeftRef.current - (x - startXRef.current) * 1.5;
    },
    [isDragging]
  );

  const handleStart = useCallback((e) => {
    if (!gridRef.current) return;
    setIsDragging(true);
    gridRef.current.classList.add("cursor-grabbing");
    const pageX = e.pageX ?? e.touches?.[0]?.pageX;
    startXRef.current = (pageX || 0) - gridRef.current.offsetLeft;
    scrollLeftRef.current = gridRef.current.scrollLeft;
  }, []);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    gridRef.current?.classList.remove("cursor-grabbing");
  }, []);

  // Chevron Vertical Positioning
  const measureChevronTop = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const imgBox = grid.querySelector(".aspect-square");
    if (!imgBox) return setChevronTop("50%");
    const rect = imgBox.getBoundingClientRect();
    const gridTop = grid.getBoundingClientRect().top;
    setChevronTop(
      `${Math.max(0, Math.round(rect.top + rect.height / 2 - gridTop))}px`
    );
  }, []);

  useLayoutEffect(() => {
    measureChevronTop();
    const ro = new ResizeObserver(measureChevronTop);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener("resize", measureChevronTop);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureChevronTop);
    };
  }, [measureChevronTop]);

  // Scroll by One Card (Left / Right)
  const scrollByOneCard = useCallback((dir = 1) => {
    const grid = gridRef.current;
    if (!grid) return;
    const card = grid.firstElementChild;
    const cardWidth = card?.getBoundingClientRect().width || 300;
    grid.scrollBy({ left: dir * (cardWidth + 16), behavior: "smooth" });
  }, []);

  if (loading || error || sortedProducts.length === 0) return null;

  return (
    <>
      <div className="w-full pt-8 bg-[#FBFAF9]">
        <div className="mx-4 sm:mx-6 md:mx-12 lg:mx-8">
          <div className="mb-6 sm:mb-8 text-center">
            <h4 className="roboto-serif text-xl font-semibold mb-2 text-gray-700 sm:text-3xl">
              Explore Related Products
            </h4>
            <p className="text-gray-600 text-body">
              Discover our curated collection of plants and gardening items
            </p>
          </div>

          {/*  Product Carousel */}
          <div className="relative">
            <button
              onClick={() => scrollByOneCard(-1)}
              className="absolute left-0 z-20 flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/90 shadow ring-1 ring-black/5 hover:bg-white transition"
              style={{ top: chevronTop, transform: "translateY(-50%)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div
              ref={gridRef}
              onMouseDown={handleStart}
              onMouseLeave={handleEnd}
              onMouseUp={handleEnd}
              onMouseMove={handleDrag}
              onTouchStart={handleStart}
              onTouchMove={handleDrag}
              onTouchEnd={handleEnd}
              className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto overflow-y-hidden pe-6 sm:pe-8 lg:pe-12 scroll-pe-4 sm:scroll-pe-6 lg:scroll-pe-8 cursor-grab select-none"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {sortedProducts.map((p) => {
                const display = getProductDisplay(p);
                return (
                  <ProductCard
                    key={p._id || p.id}
                    product={p}
                    type="item"
                    {...display}
                  />
                );
              })}
            </div>

            <button
              onClick={() => scrollByOneCard(1)}
              className="absolute right-0 z-20 flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/90 shadow ring-1 ring-black/5 hover:bg-white transition"
              style={{ top: chevronTop, transform: "translateY(-50%)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* View All */}

          <div className="text-center mt-8">
            <Link to="/ViewAll-Item">
              <button className="border border-gray-500 text-gray-600 px-8 py-2 rounded-md hover:border-gray-800 hover:text-gray-800 transition-colors duration-200 font-medium">
                View All Products
              </button>
            </Link>
          </div>
        </div>
        <div>
          <OfferBanner index={1} />
        </div>
      </div>
    </>
  );
}
