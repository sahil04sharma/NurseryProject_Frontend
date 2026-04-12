// src/components/products/helpers.js

export const FALLBACK_REMOTE = "https://placehold.co/400x400?text=No+Image";
export const FALLBACK_REMOTE_ERROR = "https://placehold.co/400x400/cccccc/666666?text=Image+Not+Available";
export const FALLBACK_LOCAL = "/no-image.png";

export const isString = (v) => typeof v === "string";

export const buildAbsoluteUrl = (raw, baseURL) => {
  if (!isString(raw) || raw.trim().length === 0) return "";
  const v = raw.trim();
  if (v.startsWith("http") || v.startsWith("data:")) return v;
  const clean = v.startsWith("/") ? v : `/${v}`;
  return `${baseURL}${clean}`;
};

export const extractImageCandidate = (img) => {
  if (!img) return "";
  if (Array.isArray(img.imageUrl) && isString(img.imageUrl[0])) return img.imageUrl[0];
  if (Array.isArray(img.urls) && isString(img.urls[0])) return img.urls[0];
  if (Array.isArray(img.images) && isString(img.images[0])) return img.images[0];
  if (isString(img.url)) return img.url;
  if (isString(img.path)) return img.path;
  if (isString(img.imageUrl)) return img.imageUrl;
  if (isString(img.src)) return img.src;
  return "";
};

export const truncate = (str, max = 20) => {
  if (!isString(str)) str = str == null ? "" : String(str);
  if (str.length <= max) return str;
  const ell = "...";
  return str.slice(0, Math.max(0, max - ell.length)) + ell;
};

export const calculateDiscount = (original, offer) => {
  if (!original || !offer) return 0;
  const orig = parseFloat(original.toString().replace(/[^0-9.]/g, ""));
  const off = parseFloat(offer.toString().replace(/[^0-9.]/g, ""));
  if (isNaN(orig) || isNaN(off) || orig === 0) return 0;
  return Math.round(((orig - off) / orig) * 100);
};
