// src/utils/slugify.js
const slugCache = new Map();

export const slugify = (str) => {
  if (!str) return "";

  const key = String(str);
  if (slugCache.has(key)) return slugCache.get(key);

  const slug = key
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  slugCache.set(key, slug);
  return slug;
};

/* 🔥 ADD THIS BELOW (DO NOT MODIFY slugify ABOVE) */
export const deslugify = (slug = "") => {
  if (!slug) return "";

  return decodeURIComponent(slug)
    .split("-")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};
