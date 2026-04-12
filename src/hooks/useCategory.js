// import { useState, useEffect, useCallback, useRef } from "react";
// import backend from "../network/backend";

// export const useCategories = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Cache + TTL
//   const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours
//   const lastFetched = useRef(0);

//   // Caches
//   const subcategoryCache = useRef(new Map());
//   const subcategoryImgCache = useRef(new Map());
//   const inFlightRequests = useRef(new Map());
//   const inFlightImgRequests = useRef(new Map());

//   // Supports browsers without requestIdleCallback
//   const runIdle = (cb) => {
//     if (typeof window.requestIdleCallback === "function")
//       window.requestIdleCallback(cb);
//     else setTimeout(cb, 50);
//   };

//   // Concurrency limiter
//   const queue = useRef([]);
//   const activeCount = useRef(0);
//   const MAX_CONCURRENT = 4;

//   const pushTask = (fn) => {
//     queue.current.push(fn);
//     processQueue();
//   };

//   const processQueue = () => {
//     if (activeCount.current >= MAX_CONCURRENT || queue.current.length === 0)
//       return;

//     activeCount.current++;
//     const task = queue.current.shift();
//     task().finally(() => {
//       activeCount.current--;
//       processQueue();
//     });
//   };

//   // FETCH CATEGORIES + Normalize Name Field
//   useEffect(() => {
//     let isMounted = true;
//     const controller = new AbortController();

//     const init = async () => {
//       try {
//         setLoading(true);

//         if (
//           Date.now() - lastFetched.current < CACHE_TTL &&
//           categories.length > 0
//         ) {
//           setLoading(false);
//           return;
//         }

//         const res = await backend.get("/product/category-all", {
//           signal: controller.signal,
//         });

//         const list = Array.isArray(res?.data?.data) ? res.data.data : [];

//         if (!isMounted) return;

//         // Normalize output: use .name but preserve original .category
//         const normalized = list.map((c) => ({
//           _id: c._id,
//           name: c.category, // UI expects .name
//           category: c.category, // backward compatibility for other components
//         }));

//         setCategories(normalized);
//         lastFetched.current = Date.now();

//         // Prefetch subcategories + images
//         normalized.forEach((cat) => {
//           if (!cat?._id) return;

//           pushTask(
//             () =>
//               new Promise((resolve) => {
//                 runIdle(async () => {
//                   await fetchSubcategories(cat._id);
//                   await fetchSubcategoryImages(cat._id);
//                   resolve();
//                 });
//               })
//           );
//         });
//       } catch (err) {
//         if (!controller.signal.aborted) {
//           console.error("Failed to fetch categories:", err);
//           if (isMounted) setCategories([]);
//         }
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     init();
//     return () => {
//       isMounted = false;
//       controller.abort();
//     };
//   }, []);

//   // FETCH SUBCATEGORIES (correct extraction)
//   const fetchSubcategories = useCallback(async (categoryId) => {
//     if (!categoryId) return [];

//     if (subcategoryCache.current.has(categoryId))
//       return subcategoryCache.current.get(categoryId);

//     if (inFlightRequests.current.has(categoryId))
//       return inFlightRequests.current.get(categoryId);

//     const controller = new AbortController();

//     const req = (async () => {
//       try {
//         const res = await backend.get(
//           `/product/sub-category/get-subCategories/${categoryId}`,
//           { signal: controller.signal }
//         );

//         const data = res?.data?.data || {};
//         const subs = Array.isArray(data?.subCategoryName)
//           ? data.subCategoryName
//           : [];

//         // Convert subcategory names into objects
//         const formatted = subs.map((name, i) => ({
//           _id: `sub-${categoryId}-${i}`,
//           name: String(name),
//         }));

//         subcategoryCache.current.set(categoryId, formatted);
//         return formatted;
//       } catch (err) {
//         if (!controller.signal.aborted) {
//           console.error("Failed subcategories:", categoryId, err);
//           subcategoryCache.current.set(categoryId, []);
//         }
//         return [];
//       } finally {
//         inFlightRequests.current.delete(categoryId);
//       }
//     })();

//     inFlightRequests.current.set(categoryId, req);
//     return req;
//   }, []);

//   // FETCH SUBCATEGORY IMAGES
//   const fetchSubcategoryImages = useCallback(async (categoryId) => {
//     if (!categoryId) return [];

//     if (subcategoryImgCache.current.has(categoryId))
//       return subcategoryImgCache.current.get(categoryId);

//     if (inFlightImgRequests.current.has(categoryId))
//       return inFlightImgRequests.current.get(categoryId);

//     const controller = new AbortController();

//     const req = (async () => {
//       try {
//         const res = await backend.get(
//           `/product/sub-category/get-subImg/${categoryId}`,
//           { signal: controller.signal }
//         );

//         const arr = Array.isArray(res?.data?.data) ? res.data.data : [];
//         const images = arr
//           .filter((it) => it?.itemBanner)
//           .map((it) => ({
//             url: it.itemBanner,
//             subCategory: it.subCategory,
//             itemName: it?.itemDetails?.name || it.subCategory,
//             _id: it._id,
//           }));

//         subcategoryImgCache.current.set(categoryId, images);
//         return images;
//       } catch (err) {
//         if (!controller.signal.aborted) {
//           console.error("Failed subcategory images:", categoryId, err);
//           subcategoryImgCache.current.set(categoryId, []);
//         }
//         return [];
//       } finally {
//         inFlightImgRequests.current.delete(categoryId);
//       }
//     })();

//     inFlightImgRequests.current.set(categoryId, req);
//     return req;
//   }, []);

//   // HELPERS
//   const getCachedSubcategories = useCallback(
//     (id) => subcategoryCache.current.get(id) || [],
//     []
//   );

//   const getCachedSubcategoryImages = useCallback(
//     (id) => subcategoryImgCache.current.get(id) || [],
//     []
//   );

//   const isLoadingSubcategories = useCallback(
//     (id) => inFlightRequests.current.has(id),
//     []
//   );

//   const isLoadingSubcategoryImages = useCallback(
//     (id) => inFlightImgRequests.current.has(id),
//     []
//   );

//   return {
//     categories,
//     loading,
//     fetchSubcategories,
//     fetchSubcategoryImages,
//     getCachedSubcategories,
//     getCachedSubcategoryImages,
//     isLoadingSubcategories,
//     isLoadingSubcategoryImages,
//   };
// };
