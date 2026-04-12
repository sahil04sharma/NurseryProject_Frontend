import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import AddToCartButton from "../../components/products/AddToCartButton";
import { toast as Toster } from "react-toastify";

export default function PlantDetailUI({ product, loading, error }) {
  const rightSectionRef = useRef(null);
  const [showPotDetails, setShowPotDetails] = useState(false);


  // Extract Base Plant Info (Memoized Once)
  const base = useMemo(() => {
    const plantName = product?.name || "Unnamed Plant";
    const plantDescription =
      typeof product?.description === "string" && product.description.trim()
        ? product.description
        : "No description available";

    const plantPrice = {
      selling: product?.price?.selling ?? null,
      offer: product?.price?.offer ?? null,
    };

    const plantBanner = (
      Array.isArray(product?.bannerImg) ? product.bannerImg : []
    )
      .map((b) => (typeof b === "string" ? b : b?.img))
      .filter(Boolean);

    const sizes = Array.isArray(product?.sizes)
      ? product.sizes.map((s) => ({
        label: s.label || s.size || "Default",
        pots: Array.isArray(s.pots) ? s.pots : [],
      }))
      : [];

    return { plantName, plantDescription, plantPrice, plantBanner, sizes };
  }, [product]);

  const { plantName, plantDescription, plantPrice, plantBanner, sizes } = base;

  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [selectedPotIdx, setSelectedPotIdx] = useState(-1);
  const [selectedColorIdx, setSelectedColorIdx] = useState(-1);
  const [mainBanner, setMainBanner] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedSize = sizes[selectedSizeIdx] || { pots: [] };
  const selectedPot =
    selectedPotIdx >= 0 ? selectedSize.pots[selectedPotIdx] : null;
  useEffect(() => {
    if (selectedPot) {
      console.log("Selected Pot Price With Pot:", selectedPot.priceWithPot);
      console.log("Selected Pot Offer Price:", selectedPot.offerPrice);

      console.log(
        "Selected Pot plantPotSellingPrice:",
        selectedPot.plantPotSellingPrice
      );
      console.log(
        "Selected Pot plantPotOfferPrice:",
        selectedPot.plantPotOfferPrice
      );
    }
  }, [selectedPot]);

  // Extract Colors for Selected Pot
  const mergedColors = useMemo(() => {
    if (!selectedPot?.potId?.variants) return [];

    const colorList = selectedPot.potId.variants.flatMap((v) =>
      (v.availableColors || []).map((c) => ({
        label: c.color,
        img: c.image,
        kind: "potColor",
      }))
    );

    const map = new Map();
    colorList.forEach((c) => {
      if (!map.has(c.label.toLowerCase())) map.set(c.label.toLowerCase(), c);
    });

    return [...map.values()];
  }, [selectedPot]);

  const selectedMergedColor =
    selectedColorIdx >= 0 ? mergedColors[selectedColorIdx] : null;

  const display = useMemo(() => {
    // 🌱 DEFAULT → PLANT INFO
    let title = plantName;
    let desc = plantDescription;
    let price = { ...plantPrice };
    let primary = plantBanner[0] || "";
    let gallery = [...plantBanner];

    // 🪴 ONLY WHEN POT MODE IS ON
    if (showPotDetails && selectedPot) {
      title = selectedPot?.potName || plantName;

      desc =
        selectedPot?.potId?.description?.join(" ") ||
        plantDescription;

      price = {
        selling: selectedPot.priceWithPot ?? plantPrice.selling,
        offer:
          selectedPot.offerPrice ??
          selectedPot.plantPotOfferPrice ??
          plantPrice.offer,
      };

      const potImages = selectedPot?.potImages || [];

      primary =
        selectedMergedColor?.img ||
        potImages[0] ||
        plantBanner[0];

      gallery = [
        ...(selectedMergedColor ? [selectedMergedColor.img] : []),
        ...potImages,
        ...plantBanner,
      ].filter(Boolean);
    }

    return {
      title,
      desc,
      price,
      primary,
      gallery: [...new Set(gallery)],
      labels: {
        size: selectedSize?.label || "",
        pot: showPotDetails ? selectedPot?.potName || "" : "",
        color: selectedMergedColor?.label || "",
      },
    };
  }, [
    plantName,
    plantDescription,
    plantPrice,
    plantBanner,
    selectedPot,
    selectedMergedColor,
    selectedSize,
    showPotDetails,
  ]);


  // Auto Select First Pot
  useEffect(() => {
    if (selectedPotIdx === -1 && sizes.length && sizes[0].pots.length) {
      setSelectedPotIdx(0);
    }
  }, [sizes, selectedPotIdx]);

  // Auto Select First Color
  useEffect(() => {
    setSelectedColorIdx(mergedColors.length ? 0 : -1);
  }, [mergedColors]);

  // Update Banner When Selection Changes
  useEffect(() => {
    setMainBanner(display.primary || display.gallery[0] || "");
    setIsExpanded(false);
  }, [display.primary]);

  // Navigation
  const currentIndex = useMemo(() => {
    const arr = display.gallery;
    const idx = arr.indexOf(mainBanner);
    return idx === -1 ? 0 : idx;
  }, [display.gallery, mainBanner]);

  const handleThumbnailClick = useCallback((src) => {
    setMainBanner(src);
  }, []);

  const navigateImage = useCallback(
    (dir) => {
      const arr = display.gallery;
      const cur = arr.indexOf(mainBanner);
      const next =
        dir === "next"
          ? (cur + 1) % arr.length
          : (cur - 1 + arr.length) % arr.length;
      setMainBanner(arr[next]);
    },
    [mainBanner, display.gallery]
  );

  // User Actions
  const handleShare = useCallback(async () => {
    try {
      const url = window?.location?.href || "";

      if (navigator.share) {
        await navigator.share({
          title: display.title,
          text: display.desc,
          url,
        });
        Toster.success("Share dialog opened");
      } else {
        await navigator.clipboard.writeText(url);
        Toster.success("Link copied to clipboard");
      }
    } catch {
      Toster.error("Unable to share");
    }
  }, [display.title, display.desc]);

  /* SELECT FUNCTIONS */
  const onSelectSize = useCallback(
    (idx) => {
      setSelectedSizeIdx(idx);
      setSelectedPotIdx(sizes[idx]?.pots?.length ? 0 : -1);
      setSelectedColorIdx(-1);
    },
    [sizes]
  );

  const onSelectPot = useCallback((idx) => {
    setSelectedPotIdx(idx);
    setSelectedColorIdx(-1);
  }, []);

  const onSelectColor = useCallback((idx) => {
    setSelectedColorIdx(idx);
  }, []);

  // Discount
  const discount = useMemo(() => {
    const { selling, offer } = display.price;
    return selling && offer && offer < selling
      ? Math.round(((selling - offer) / selling) * 100)
      : 0;
  }, [display.price]);

  // Description Truncate
  const { shouldTruncate, displayedDescription } = useMemo(() => {
    const text = display.desc;
    const short = text.length > 200;
    return {
      shouldTruncate: short,
      displayedDescription: short && !isExpanded ? text.slice(0, 200) : text,
    };
  }, [display.desc, isExpanded]);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );

  const gallery = display.gallery;

  return (
    <div className="border-b border-gray-300 bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT SECTION – identical UI */}
          <div className="flex flex-row gap-4">
            {/* Thumbnails */}
            <div className="hidden md:flex md:flex-col gap-3 overflow-y-auto max-h-[600px] pr-2">
              {gallery.map((src, i) => {
                const active = mainBanner === src;
                return (
                  <button
                    key={src + i}
                    onClick={() => handleThumbnailClick(src)}
                    className={`w-28 h-28 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${active
                        ? "border-gray-800"
                        : "border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </button>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="relative w-1 shrink-0 hidden md:block">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-200 rounded-full" />
              <div
                className="absolute left-1/2 -translate-x-1/2 w-1 bg-gray-800 rounded-full transition-all duration-300"
                style={{
                  top: `${(currentIndex / Math.max(gallery.length - 1, 1)) * 100
                    }%`,
                  height:
                    gallery.length > 1 ? `${100 / gallery.length}%` : "100%",
                }}
              />
            </div>

            {/* Main Image */}
            <div className="flex-1 relative">
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-gray-50">
                <img
                  src={mainBanner}
                  className="w-full h-full object-cover"
                  alt=""
                />

                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateImage("prev")}
                      className="absolute top-1/2 left-4 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigateImage("next")}
                      className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Mobile thumbnails */}
              <div className="flex md:hidden gap-3 overflow-x-auto pt-3">
                {gallery.map((src, i) => {
                  const active = mainBanner === src;
                  return (
                    <button
                      key={src + i}
                      onClick={() => handleThumbnailClick(src)}
                      className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${active
                          ? "border-gray-800"
                          : "border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      <img
                        src={src}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION – identical UI */}
          <div ref={rightSectionRef} className="space-y-3">
            {/* Title */}
            <div>
              <h4 className="heading-4 text-gray-900 mb-2">{display.title}</h4>
              <div className="flex items-center gap-2 text-sm text-[#1a4122]">
                <span>★★★★★</span>
                <span>4.0</span>
                <span className="text-gray-400">|</span>
                <span>12 sold</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 border-b border-gray-300 pb-4">
              <span className="text-3xl font-medium text-gray-900">
                ₹{display.price.offer ?? display.price.selling}
              </span>

              {display.price.offer &&
                display.price.selling &&
                display.price.offer < display.price.selling && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{display.price.selling}
                    </span>
                    <span className="px-2 bg-green-100 text-green-600 text-sm rounded">
                      Save {discount}%
                    </span>
                  </>
                )}
            </div>

            {/* Description */}
            <div className="border-b border-gray-300 pb-4">
              <p className="text-body text-gray-600 leading-relaxed inline">
                {displayedDescription}
                {shouldTruncate && (
                  <button
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="text-sm text-[#1A4122] ml-1"
                  >
                    {isExpanded ? "Read Less ↑" : "Read More ↓"}
                  </button>
                )}
              </p>
            </div>

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Size:</span>
                  <span className="text-sm text-gray-600">
                    {display.labels.size}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sizes.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectSize(i)}
                      className={`px-4 py-2 rounded-md border text-sm ${i === selectedSizeIdx
                          ? "border-gray-800"
                          : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-b border-gray-300 pb-4">
              <button
                onClick={() => setShowPotDetails((prev) => !prev)}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition ${showPotDetails
                    ? "bg-[#1a4122] text-white border-[#1a4122]"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
              >
                {showPotDetails ? "Hide Pot Details" : "Choose a Pot"}
              </button>
            </div>


            {/* Pot Selector */}
            {showPotDetails && selectedSize.pots.length > 0 && (
              <div className="border-b border-gray-200 pb-4">
                {selectedSize.pots.length > 0 && (
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Pot:</span>
                      <span className="text-sm text-gray-600">
                        {display.labels.potSubcats}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {selectedSize.pots.map((p, i) => {
                        const thumb =
                          p.potImages?.[0] ||
                          p.availableColors?.[0]?.imageWithPlant ||
                          plantBanner[0] ||
                          "";

                        const active = i === selectedPotIdx;

                        return (
                          <button
                            key={i}
                            onClick={() => onSelectPot(i)}
                            className={`px-2 py-2 rounded-md border text-sm flex items-center gap-2 ${active
                                ? "border-gray-800 font-medium"
                                : "border-gray-300 hover:border-gray-400"
                              }`}
                          >
                            <img
                              src={thumb}
                              className="w-6 h-6 object-cover rounded-md"
                              alt=""
                            />
                            <p className="text-body">
                              {Array.isArray(product?.subCategory)}
                            </p>
                            {display.labels.potSubcats && (
                              <p className="text-gray-600">
                                {display.labels.potSubcats}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Color Selector */}
            {showPotDetails && mergedColors.length > 0 && (
              <div className="border-b border-gray-300 pb-4">
                {mergedColors.length > 0 && (
                  <div className="border-b border-gray-300 pb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Color:</span>
                      <span className="text-sm text-gray-600">
                        {mergedColors[selectedColorIdx]?.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {mergedColors.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => onSelectColor(i)}
                          className={`px-3 py-2 rounded-md border text-sm flex items-center gap-2 ${i === selectedColorIdx
                              ? "border-gray-800 bg-gray-50 font-medium"
                              : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                          <img
                            src={c.img}
                            className="w-6 h-6 rounded-sm object-cover border"
                            alt={c.label}
                          />
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>{" "}
                  <span className="px-6 py-2 text-center min-w-[60px] border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />{" "}
                  </button>{" "}
                </div>{" "}
                {product?.stock < 5 && (
                  <div className="text-sm text-gray-600">
                    {" "}
                    Only{" "}
                    <span className="text-orange-600 font-medium">
                      {" "}
                      {product?.stock || 0} items{" "}
                    </span>{" "}
                    left!{" "}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <AddToCartButton
                product={{
                  id: `${product?.type || "plant"}:${product?.id || product?._id
                    }`,
                  name: display.title,
                  price: display.price.offer ?? display.price.selling,
                  image: mainBanner,
                  quantity,
                  variant: display.labels.size,
                  color: display.labels.color,
                  pot: display.labels.pot,
                }}
              >
                ADD TO CART
              </AddToCartButton>

              <button className="flex-1 bg-white border-2 border-[#1a4122] py-4 rounded-lg font-medium hover:bg-[#1a4122] hover:text-white transition-colors">
                BUY IT NOW
              </button>
            </div>

            {/* Wishlist + Share */}
            <div className="flex gap-4 pt-2">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <Heart className="w-5 h-5" /> Add to Wishlist
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Share2 className="w-5 h-5" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
