// src/components/ProductDetails/api/usePlantApi.js
import backend from "../../../network/backend";

const CACHE_OPTIONS = {
  staleTime: 60000,
  cacheTime: 900000,
};

export async function fetchPlantById(id, signal) {
  try {
    const res = await backend.cachedGet(`/admin/plant/get/${id}`, {
      signal,
      ...CACHE_OPTIONS,
    });

    const src = res?.data?.plant;
    if (!src) throw new Error("Plant not found");

    const plantInfo = src.plantId || {};
    const availableSizes = src.availableSizes || [];

    /* ----------------------------- 📝 Utility Helpers ----------------------------- */

    // ✅ Clean description (array or string)
    const parseDescription = (desc) => {
      if (Array.isArray(desc)) return desc.join(" ");
      if (typeof desc === "string") return desc;
      return "No description available.";
    };

    // ✅ Flatten variants if exist
    const normalizeVariants = (variants) => {
      if (!Array.isArray(variants)) return [];
      return variants.map((v) => ({
        label: v.label || v.size || "Default",
        sellingPrice: v.sellingPrice || null,
        offerPrice: v.offerPrice || null,
        stock: v.stock || 0,
        variantImg: v.variantImg || "",
        availableColors:
          v.availableColors?.map((c) => ({
            color: c.color,
            image: c.image,
            stock: c.stock || 0,
          })) || [],
      }));
    };

    // ✅ Extract all color categories from plant or pots
    const extractColorCategories = (availableSizes) => {
  const colorSet = new Set();

  availableSizes?.forEach((size) => {
    size.potsList?.forEach((pot) => {
      pot.availableColors?.forEach((c) => {
        if (c.color) colorSet.add(c.color);
      });
    });
  });

  return Array.from(colorSet);
};


    /* ----------------------------- 🪴 Main Data Parsing ----------------------------- */

    // 🌱 Extract all sizes with pots and colors
    const sizesData = availableSizes.map((size) => ({
  size: size.size,
  shippingInfo: size.shippingInfo || {},
  pots:
    size.potsList?.map((pot) => {
      const firstVariant = pot.potId?.variants?.[0] || {};

      return {
        potId: pot.potId,
        
        potName: pot.potId?.name || "Unnamed Pot",
        potCategory: pot.potId?.category || "Uncategorized",
        potSubCategory: pot.potId?.subCategory || [],
        potImages: pot.potId?.bannerImg || [],

        // ⭐ POT PRICES (real from backend)
        potSellingPrice: firstVariant.sellingPrice ?? null,
        potOfferPrice: firstVariant.offerPrice ?? null,

        // ⭐ Price attached to plant+pot
        priceWithPot: pot.priceWithPot,
        offerPrice: pot.offerPrice,

        plantPotSellingPrice: pot.priceWithPot,
plantPotOfferPrice: pot.offerPrice,

        availableColors:
          pot.availableColors?.map((c) => ({
            color: c.color,
            imageWithPlant: c.imageWithPlant,
          })) || [],
      };
    }) || [],
}));


    // 🪴 Pick first available pot for display price
    const firstPot = availableSizes?.[0]?.potsList?.[0] || {};

    /* ----------------------------- 🌿 Return Final Object ----------------------------- */
    return {
      id: src._id || id,
      type: "plant",
      name: plantInfo.name || "Unnamed Plant",
      category: plantInfo.category || "Uncategorized",
      subCategory:
        Array.isArray(plantInfo.subCategory) &&
        plantInfo.subCategory.length > 0
          ? plantInfo.subCategory
          : [],
      description: parseDescription(plantInfo.description),
      bannerImg: plantInfo.bannerImg || [],
      variants: normalizeVariants(plantInfo.variants),
      colorCategory: extractColorCategories(availableSizes),


      // 🏷️ Price Handling
      price: {
        selling:
          firstPot.priceWithPot ??
          plantInfo.sellingPrice ??
          null,
        offer:
          firstPot.offerPrice ??
          plantInfo.offerPrice ??
          null,
      },

      sizes: sizesData,
      stock: plantInfo.stock || 0,
      shippingInfo:
        availableSizes?.[0]?.shippingInfo ||
        plantInfo.shippingInfo ||
        {},

      createdAt: src.createdAt,
      updatedAt: src.updatedAt,
      createdBy: src.createdBy,
      updatedBy: src.updatedBy,
    };
  } catch (err) {
    console.error("❌ fetchPlantById error:", err);
    throw new Error(
      err?.response?.data?.message || "Failed to fetch plant details"
    );
  }
}
