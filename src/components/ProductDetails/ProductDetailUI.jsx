import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Star,
} from "lucide-react";
import AddToCartButton from "../../components/products/AddToCartButton";
import { toast as Toster } from "react-toastify";
import BuyNowButton from "../products/BuyNowButton";
import NotifyMe from "../products/NotifyMe";
import { useProductSelection } from "../../hooks/useProductSelection";
import StarRating from "../common/StarRating";
import { useWishlist } from "../../ContextApi/WishlistContext";

export default function ProductDetailUI({ product, loading, error }) {
  const [mainBanner, setMainBanner] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const rightSectionRef = useRef(null);
  const { wishedItems, toggleWishlist } = useWishlist();

  const bannerImg = useMemo(() => {
    const raw = Array.isArray(product?.bannerImg) ? product.bannerImg : [];
    return raw.map((b) => (typeof b === "string" ? b : b?.img)).filter(Boolean);
  }, [product]);

  const {
    variants,
    selectedVariant,
    setSelectedVariant,
    selectedColor,
    setSelectedColor,
    quantity,
    setQuantity,
    prices,
    availableStock,
    isOutOfStock,
  } = useProductSelection(product, bannerImg);
  const description = useMemo(() => {
    if (typeof product?.details === "string" && product.details.trim())
      return product.details;
    return "No description available";
  }, [product]);

  const name = product?.name || "";
  const wished = wishedItems.find((w) => w?.productId === product?._id);

  useEffect(() => {
    if (!product) return;
    const firstBanner = bannerImg[0] || "";
    const firstVariantImg = variants[0]?.variantImg || "";
    const firstColorImg = selectedVariant?.colors?.[0]?.image || "";
    const initialImg = firstVariantImg || firstColorImg || firstBanner || "";

    setMainBanner(initialImg);
    setSelectedColor(selectedVariant?.colors?.[0] || null);
    setSelectedVariant(variants[0] || null);
    setIsExpanded(false);
    setQuantity(1);
  }, [product, bannerImg, variants]);

  // MEMOIZED VALUES
  const currentIndex = () => {
    const index = bannerImg.findIndex((src) => src === mainBanner);
    return index === -1 ? 0 : index;
  };

  const discount = useMemo(() => {
    const { offer, selling } = prices;
    if (selling > offer && selling !== 0)
      return Math.round(((selling - offer) / selling) * 100);
    return 0;
  }, [prices]);

  const shouldTruncate = description.length > 200;
  const displayedDescription =
    shouldTruncate && !isExpanded ? description.slice(0, 200) : description;

  // ====== HANDLERS ======
  const handleThumbnailClick = (src) => setMainBanner(src);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setMainBanner(color?.image || bannerImg[0] || "");
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setMainBanner(variant?.variantImg || bannerImg[0] || "");
  };

  const navigateImage = (direction) => {
    if (!bannerImg.length) return;
    const idx = bannerImg.indexOf(mainBanner);
    const current = idx === -1 ? 0 : idx;
    const nextIdx =
      direction === "next"
        ? (current + 1) % bannerImg.length
        : (current - 1 + bannerImg.length) % bannerImg.length;
    setMainBanner(bannerImg[nextIdx]);
  };

  const handleShare = async () => {
    try {
      const url = window?.location?.href || "";
      if (navigator.share) {
        await navigator.share({
          title: name || "Product",
          text: description || "",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        Toster.success("Link copied to clipboard");
      }
    } catch {
      Toster.error("Unable to share");
    }
  };

  useEffect(() => {
    if (!selectedVariant) return;

    const inStockColor =
      selectedVariant.colors?.find((c) => c.stock > 0) ||
      selectedVariant.colors?.[0] ||
      null;

    setSelectedColor(inStockColor);
    setMainBanner(
      inStockColor?.image || selectedVariant?.variantImg || bannerImg[0] || ""
    );
  }, [selectedVariant, bannerImg]);

  // LOADING / ERROR STATES
  if (loading)
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );

  return (
    <div className=" border-b border-gray-300 bg-white pb-6">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-8 md:pt-6 lg:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT - Image Gallery */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative order-1 md:order-2">
              <div className="relative  aspect-4/5  rounded-2xl overflow-hidden bg-gray-50">
                <img
                  src={mainBanner || bannerImg[0] || ""}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                {bannerImg.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateImage("prev")}
                      className="absolute top-1/2 left-4 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigateImage("next")}
                      className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="relative w-1 shrink-0 hidden md:block md:order-1">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-200 rounded-full" />
              <div
                className="absolute left-1/2 -translate-x-1/2 w-1 bg-gray-800 rounded-full transition-all duration-300"
                style={{
                  top: `${
                    (currentIndex / Math.max(bannerImg.length - 1, 1)) * 100
                  }%`,
                  height:
                    bannerImg.length > 1
                      ? `${100 / bannerImg.length}%`
                      : "100%",
                }}
              />
            </div>

            <div className="order-2 md:order-0">
              <div className="flex md:hidden gap-3 overflow-x-auto pt-2">
                {bannerImg.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => handleThumbnailClick(src)}
                    className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      mainBanner === src
                        ? "border-gray-800"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="hidden md:flex md:flex-col gap-3 overflow-y-auto max-h-[600px] pr-2">
                {bannerImg.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => handleThumbnailClick(src)}
                    className={`w-28 h-28 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      mainBanner === src
                        ? "border-gray-800"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div ref={rightSectionRef} className="md:space-y-3">
            {/* Product Info */}
            <div>
              <h4 className="text-xl md:text-2xl text-gray-900 md:mb-2">
                {name}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <StarRating rating={product?.rating?.average} />
                </div>
                <span>{product?.rating?.average}/5</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 border-b border-gray-300 pb-2 md:pb-4">
              <span className="text-xl md:text-3xl font-medium text-gray-900">
                ₹{prices.offer}
              </span>
              {prices.selling > prices.offer && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ₹{prices.selling}
                  </span>
                  <span className="px-2 bg-green-100 text-green-600 text-sm rounded">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="border-b border-gray-300 pb-2 md:pb-4">
              <p className="roboto-serif text-xs sm:text-sm text-gray-600 leading-relaxed inline">
                {displayedDescription}
                {shouldTruncate && (
                  <button
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="text-sm text-[#1A4122] font-medium hover:underline ml-1 inline-flex items-center gap-1"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                    <span className="text-xs">{isExpanded ? "↑" : "↓"}</span>
                  </button>
                )}
              </p>
            </div>

            {/* Colors */}
            {selectedVariant?.colors.length > 0 && (
              <div className="border-b border-gray-300 pb-2 md:pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    Color:
                  </span>
                  {selectedColor && (
                    <span className="text-xs sm:text-sm text-gray-600">
                      {selectedColor.color}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedVariant?.colors?.map((color) => {
                    const isDisabled = color.stock <= 0;
                    const isActive = selectedColor?.color === color.color;

                    return (
                      <button
                        key={color.color}
                        onClick={() => handleColorSelect(color)}
                        className={`pr-1 rounded-md border text-sm flex items-center gap-2 ${
                          isActive
                            ? "border-gray-800 bg-gray-50 font-medium"
                            : "border-gray-300"
                        } ${
                          isDisabled ? "opacity-70" : "hover:border-gray-400"
                        }`}
                      >
                        <span
                          className="w-8 h-8"
                          style={{
                            backgroundImage: `url(${color.image})`,
                            backgroundSize: "cover",
                          }}
                        />
                        {color.color}
                      </button>
                    );
                  })}
                </div>
                <span className="text-red-400 text-xs">
                  {isOutOfStock && "out of stock!"}
                </span>
              </div>
            )}

            {/* Variants */}
            {variants.length > 0 && (
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    Size:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => handleVariantSelect(variant)}
                      className={`px-4 py-2 rounded-md border text-xs sm:text-sm transition-all ${
                        selectedVariant?._id === variant._id
                          ? "border-gray-800 bg-gray-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="font-medium">{variant.label}</div>
                      {variant.dimensions && (
                        <div className="text-[10px] text-gray-500 ">
                          {variant.dimensions.length}×
                          {variant.dimensions.breadth}×
                          {variant.dimensions.height}cm
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <span className="text-sm font-medium text-gray-900 block mb-3">
                Quantity
              </span>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    disabled={quantity === 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="px-6 py-2 text-center max-w-[60px] border-x border-gray-300">
                    {quantity}
                  </span>

                  <button
                    disabled={quantity >= availableStock || isOutOfStock}
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {product?.stock < 5 && product?.stock > 0 && (
                  <div className="text-sm text-gray-600">
                    Only{" "}
                    <span className="text-orange-600 font-medium">
                      {product?.stock}
                    </span>{" "}
                    left!
                  </div>
                )}
              </div>
            </div>

            {/* OUT OF STOCK LOGIC — SHOW POPUP FOR BOTH BUTTONS */}
            {isOutOfStock ? (
              <div className="pt-4">
                <NotifyMe
                  product={{
                    productId: product._id,
                    variantLabel: selectedVariant?.label,
                    color: selectedColor?.color,
                  }}
                />
              </div>
            ) : (
              <>
                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <AddToCartButton
                    product={{
                      itemId: product._id,
                      plantId: product._id,
                      potId: product._id,
                      productType: product.__type,
                      quantity,
                      size: selectedVariant?.label,
                      color: selectedColor?.color,
                    }}
                  >
                    Add To Cart
                  </AddToCartButton>

                  <BuyNowButton
                    product={{
                      itemId: product._id,
                      plantId: product._id,
                      potId: product._id,
                      productType: product.__type,
                      quantity,
                      name: product?.name,
                      displayImage: mainBanner,
                      offerPrice: prices.offer,
                      sellingPrice: prices.selling,
                      size: selectedVariant?.label,
                      color: selectedColor?.color,
                    }}
                  />
                </div>
              </>
            )}

            {/* Wishlist + Share */}
            <div className="flex gap-4 pt-2">
              <button
                onClick={() =>
                  toggleWishlist({
                    productId: product._id,
                    wishlistId: wished?.wishlistId,
                  })
                }
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <Heart
                  color={wished ? "#DE291B" : "#1a4122"}
                  fill={wished ? "#DE291B" : "#faf9f7"}
                  className="w-5 h-5"
                />
                Add to Wishlist
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
