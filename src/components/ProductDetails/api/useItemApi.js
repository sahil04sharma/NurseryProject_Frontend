import backend from "../../../network/backend";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop";

// Safely parse description array, JSON, or string
function parseDescription(raw) {
  if (!raw) return "No description available";

  try {
    const items = Array.isArray(raw) ? raw : [raw];
    const parsed = items.flatMap((desc) => {
      let d = desc;
      while (
        typeof d === "string" &&
        (d.startsWith("[") || d.startsWith("{"))
      ) {
        d = JSON.parse(d);
        if (Array.isArray(d)) d = d[0];
      }
      return d;
    });

    return parsed.join(" ").trim() || "No description available";
  } catch {
    return Array.isArray(raw) ? raw.join(" ") : String(raw);
  }
}

// Extract banner images in priority order
function extractBannerImages({
  bannerImg = [],
  variants = [],
  colorCategory = [],
  availableSizes = {},
}) {
  const candidates = [
    ...bannerImg,
    variants?.[0]?.variantImg,
    colorCategory?.[0]?.image,
    availableSizes?.potsList?.availableColors?.[0]?.imageWithPlant,
  ].filter(Boolean);

  // Only add fallback if nothing else is available
  if (candidates.length === 0) candidates.push(FALLBACK_IMG);

  return candidates.map((img) => ({ img }));
}

// Extract color categories from variants or colorCategory
function extractColorCategories(src) {
  const map = new Map();

  (src.variants || []).forEach((v) => {
    (v.availableColors || []).forEach((c) => {
      const key = c.color;
      if (!map.has(key)) {
        map.set(key, {
          _id: `${v._id}_${c.color}`,
          color: c.color,
          image: c.image,
          stock: c.stock ?? 0,
        });
      } else {
        map.get(key).stock += c.stock ?? 0;
      }
    });
  });

  return Array.from(map.values());
}

// Compute effective price & stock
function computeEffectiveData(src) {
  const firstVariant = src?.variants?.[0] || {};
  const sellingPrice =
    src?.availableSizes?.potsList?.priceWithPot ??
    firstVariant.sellingPrice ??
    src.sellingPrice ??
    null;
  const offerPrice =
    src?.availableSizes?.potsList?.offerPrice ??
    firstVariant.offerPrice ??
    src.offerPrice ??
    null;

  const stock =
    src?.variants.length > 0
      ? src?.variants?.reduce(
          (sum, v) =>
            sum +
            (v.availableColors || []).reduce((s, c) => s + (c.stock ?? 0), 0),
          0
        )
      : src.stock ?? 0;

  return { sellingPrice, offerPrice, stock };
}

// Extract variants with colors, prices & stock
export function extractVariantsWithColors(src) {
  if (!Array.isArray(src?.variants)) return [];

  return src.variants.map((variant, vIdx) => {
    const colors = (variant.availableColors || []).map((c) => ({
      color: c.color,
      image: c.image,
      stock: c.stock ?? 0,
    }));

    const totalStock = colors.reduce((sum, c) => sum + (c.stock ?? 0), 0);

    return {
      _id: variant._id || `${src._id}_variant_${vIdx}`,
      label: variant.label || `Variant ${vIdx + 1}`,
      sellingPrice: variant.sellingPrice ?? src.sellingPrice ?? null,
      offerPrice: variant.offerPrice ?? src.offerPrice ?? null,
      totalStock,
      colors,
    };
  });
}

// Generic fetch for item or plant
async function fetchEntity(endpoint, id, signal, kind) {
  try {
    const res = await backend.cachedGet(`${endpoint}/${id}`, {
      signal,
      staleTime: 30000,
      cacheTime: 300000,
    });
    const src =
      res?.data?.[kind === "plant" ? "plant" : "item"] ||
      res?.data?.data ||
      res?.data;
    if (!src)
      throw new Error(`${kind === "plant" ? "Plant" : "Product"} not found`);

    const rawDesc =
      kind === "plant"
        ? src?.plantInfo?.description || src?.description
        : src?.description;
    const details = parseDescription(rawDesc);

    // const variants = normalizeVariants(src.variants || []);
    const variants = extractVariantsWithColors(src);
    const colorCategory = extractColorCategories(src);

    const rating = {
      average: src?.rating?.average ?? 0,
      total: src?.rating?.total ?? 0,
    };

    const bannerImg = extractBannerImages(src);
    const { sellingPrice, offerPrice, stock } = computeEffectiveData(src);

    return {
      _id: src._id || id,
      __type: kind,
      name:
        kind === "plant"
          ? src?.plantInfo?.name || src?.name || "Plant"
          : src.name || "Product",
      category: src.category || "Uncategorized",
      subCategory:
        kind === "plant"
          ? Array.isArray(src?.plantInfo?.subCategory)
            ? src.plantInfo.subCategory
            : src?.subCategory || []
          : src.subCategory || [],
      colorCategory,
      variants,
      details,
      sellingPrice,
      offerPrice,
      stock,
      rating,
      bannerImg,
      createdAt: src.createdAt,
      updatedAt: src.updatedAt,
      createdBy: src.createdBy,
      updatedBy: src.updatedBy,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export const fetchItemById = (id, signal) =>
  fetchEntity("/item/get-id", id, signal, "item");
export const fetchPlantById = (id, signal) =>
  fetchEntity("/admin/plant/get", id, signal, "plant");
export async function fetchEntityById(id, signal, kind) {
  return kind === "plant"
    ? fetchPlantById(id, signal)
    : fetchItemById(id, signal);
}
