import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useWishlist } from "./../../ContextApi/WishlistContext.jsx";
import {
  FALLBACK_REMOTE,
  FALLBACK_REMOTE_ERROR,
  FALLBACK_LOCAL,
  truncate,
  calculateDiscount,
} from "./helpers";
import StarRating from "../common/StarRating.jsx";

export default function ProductCard({
  Id,
  product,
  getProductDisplay,
  type,
  name,
  image,
  price,
  originalPrice,
  description,
  stock,
  category,
  rating,
  hasPot,
}) {
  const { wishlistProducts, toggleWishlist } = useWishlist();

  // Memoized Derived Object
  const derived = useMemo(() => {
    if (
      name ||
      image ||
      price ||
      originalPrice ||
      description ||
      category ||
      rating ||
      hasPot
    ) {
      return {};
    }
    if (typeof getProductDisplay === "function") {
      try {
        return getProductDisplay(product) || {};
      } catch {
        return {};
      }
    }
    return {};
  }, [
    product,
    name,
    image,
    price,
    originalPrice,
    description,
    category,
    rating,
    hasPot,
    getProductDisplay,
  ]);

  // Memoized Product Display Fields
  const displayName = useMemo(() => {
    return (
      name ??
      derived.name ??
      product?.plantInfo?.name?.trim?.() ??
      product?.name?.trim?.() ??
      product?.product?.name?.trim?.() ??
      "Unnamed Product"
    );
  }, [name, derived, product]);

  const displayImage = useMemo(() => {
    return (
      image ??
      derived.image ??
      product?.availableSizes?.potsList?.availableColors?.[0]?.imageWithPlant ??
      product?.bannerImg?.[0] ??
      product?.variants?.[0]?.variantImg ??
      product?.colorCategory?.[0]?.image ??
      FALLBACK_REMOTE
    );
  }, [image, derived, product]);

  const displayPrice = useMemo(() => {
    return (
      price ??
      derived.price ??
      product?.availableSizes?.potsList?.[0]?.priceWithPot ??
      product?.availableSizes?.[0]?.potsList?.[0]?.priceWithPot ??
      product?.availableSizes?.[0]?.potsList?.[0]?.offerPricer ??
      product?.variants?.[0]?.sellingPrice ??
      product?.sellingPrice ??
      product?.defaultPrice ??
      "N/A"
    );
  }, [price, derived, product]);

  const displayOriginalPrice = useMemo(() => {
    return (
      originalPrice ??
      derived.originalPrice ??
      product?.availableSizes?.potsList?.offerPrice ??
      product?.variants?.[0]?.offerPrice ??
      product?.offerPrice ??
      null
    );
  }, [originalPrice, derived, product]);

  const displayDescription = useMemo(() => {
    return (
      description ??
      derived.description ??
      product?.description ??
      product?.desc ??
      (hasPot ?? derived.hasPot ?? !!product?.potDetails
        ? "Plant with Pot"
        : "High-quality plant for your space.")
    );
  }, [description, derived, hasPot, product]);

  const displayCategory = useMemo(() => {
    return (
      category ??
      derived.category ??
      (Array.isArray(product?.plantInfo?.subCategory)
        ? product.plantInfo.subCategory.join(", ")
        : product?.product?.category || "")
    );
  }, [category, derived, product]);

  const displayRating = useMemo(() => {
    const r = rating ?? derived.rating ?? product?.rating;
    if (typeof r === "object" && r !== null) {
      return r.average ?? 0;
    }
    return r ?? 4.5;
  }, [rating, derived, product]);

  const productId = useMemo(
    () => Id || product?._id || product?.id,
    [Id, product]
  );

  // Derived & Wishlist Logic Optimized
  const discount = useMemo(
    () => calculateDiscount(displayPrice, displayOriginalPrice),
    [displayPrice, displayOriginalPrice]
  );

  const wished = useMemo(() => {
    return wishlistProducts.find(
      (p) => (p?.items?.productId || p?.product?._id) === productId
    );
  }, [wishlistProducts, productId]);

  const handleWishlist = () => {
    toggleWishlist({ productId: product?._id, wishlistId: wished?._id });
  };

  // Optimized Image Fallback Handler
  const handleImageError = (e) => {
    const el = e.currentTarget;
    if (el.dataset.fallbackStage === "0") {
      el.src = FALLBACK_REMOTE_ERROR;
      el.dataset.fallbackStage = "1";
    } else {
      el.src = FALLBACK_LOCAL;
      el.onerror = null;
    }
  };

  return (
    <div
      key={productId}
      className="shrink-0 w-[46%] sm:w-1/3 md:w-1/4 lg:w-1/4 rounded-lg p-2 transition-transform hover:scale-[1.02] duration-200"
    >
      <div className="select-none relative mb-3 sm:mb-4">
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-[#1A4122] text-white text-[8px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded z-10">
            {discount}% OFF
          </div>
        )}

        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 transition-transform hover:scale-110 z-10"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-5 h-5 ${
              wished ? "fill-red-500 text-red-500" : "text-white drop-shadow-md"
            }`}
          />
        </button>

        <Link to={`/product/${type}/${productId}`}>
          <div className="select-none aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={displayImage}
              alt={displayName}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={handleImageError}
              data-fallback-stage="0"
              style={{
                userSelect: "none",
                WebkitUserDrag: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
              }}
            />
          </div>
        </Link>
      </div>

      <div className="select-none sm:space-y-1 px-0.5 sm:px-1 pb-2 min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <h3
            className="text-xs sm:text-lg roboto-serif leading-tight truncate"
            title={displayName}
          >
            {displayName}
          </h3>

          {displayCategory && (
            <span
              className="shrink-0 max-w-[55%] truncate text-right text-[8px] sm:text-xs text-[#1A4122] bg-green-100 px-2 py-0.5 rounded-full"
              title={displayCategory}
            >
              {displayCategory}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center">
            <StarRating rating={displayRating?.average ?? displayRating ?? 4} />
          </div>
          <p className="text-xs text-gray-600">
            {displayRating?.average ?? displayRating ?? 4}
          </p>
        </div>

        <p className="text-xs sm:text-sm roboto-serif text-gray-600 sm:pb-1 border-gray-200 border-b truncate">
          {displayDescription}
        </p>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap pt-1">
          <p className="text-body text-gray-900">
            ₹{displayOriginalPrice || displayPrice}
          </p>

          {displayOriginalPrice && (
            <p className="text-body sm:text-sm text-gray-500 line-through">
              ₹{displayPrice}
            </p>
          )}
        </div>

        <Link to={`/product/${type}/${productId}`}>
          <button className="text-xs md:text-lg flex items-center w-full justify-center flex-1 border border-gray-300 bg-[#1A4122] py-2 sm:px-2 sm:py-2.5 rounded font-medium hover:bg-[#0f2614] transition-colors text-white">
            View Product
          </button>
        </Link>
      </div>
    </div>
  );
}
