// // src/components/Sidebar/SidebarCategoriesWithSubs.jsx
// import { useEffect, useMemo, useRef, useState, useCallback } from "react";
// import { useLocation } from "react-router-dom";
// import { useCategories } from "../../hooks/useCategory"; // <-- KEY CHANGE
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";

// export default function SidebarCategoriesWithSubs({
//   className = "",
//   onSelectCategory,
//   onSelectSubCategory,
//   onPriceFilterChange,
//   onClearAll,
//   onCategoriesLoaded,

//   selectedCategory = null,
//   selectedSubNames = [],
//   priceFilter = null,

//   openMobile = true,
//   setOpenMobile,
// }) {
//   const {
//     categories,
//     loading: loadingCats,
//     fetchSubcategories,
//     getCachedSubcategories,
//     isLoadingSubcategories,
//   } = useCategories();

//   const [selectedSubsByCategory, setSelectedSubsByCategory] = useState(() => new Map());
//   const [allCheckedByCategory, setAllCheckedByCategory] = useState(() => new Map());
//   const [activeCategory, setActiveCategory] = useState(null);

//   const [customMinPrice, setCustomMinPrice] = useState("");
//   const [customMaxPrice, setCustomMaxPrice] = useState("");
//   const [loadingPrice, setLoadingPrice] = useState(false);
//   const [errorPrice, setErrorPrice] = useState("");
// const PRICE_MIN = 0;
// const PRICE_MAX = 2000;

// const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);

//   const priceAbortRef = useRef(null);
//   const location = useLocation();

//   const searchParams = new URLSearchParams(location.search);
// const urlCategory = searchParams.get("category");

//   // Reset on route change
// useEffect(() => {
//   setActiveCategory(null);
//   setSelectedSubsByCategory(new Map());
//   setAllCheckedByCategory(new Map());
//   setCustomMinPrice("");
//   setCustomMaxPrice("");
//   setPriceRange([PRICE_MIN, PRICE_MAX]);
//   setErrorPrice("");
// }, [location.pathname]);

//   // Notify parent categories loaded
//   useEffect(() => {
//     if (typeof onCategoriesLoaded === "function") {
//       onCategoriesLoaded(categories.map((c) => c.name));
//     }
//   }, [categories, onCategoriesLoaded]);

//   /* ---------------------------------------------
//       Get Category _id and fetch subs once
//   ---------------------------------------------- */
//   const loadSubsByName = useCallback(async (catName) => {
//     const catObj = categories.find((c) => c.name === catName);
//     if (!catObj?._id) return;
//     await fetchSubcategories(catObj._id);
//   }, [categories, fetchSubcategories]);

//   /* ---------------------------------------------
//    🔁 SYNC: Parent → Sidebar (AUTO CHECK)
// ---------------------------------------------- */
// useEffect(() => {
//   if (!selectedCategory?.name) {
//     setSelectedSubsByCategory(new Map());
//     setAllCheckedByCategory(new Map());
//     setActiveCategory(null);
//     return;
//   }

//   const category = selectedCategory.name;
//   setActiveCategory(category);

//   // Load subcategories if not already loaded
//   loadSubsByName(category);

//   setSelectedSubsByCategory(() => {
//     const map = new Map();

//     if (selectedSubNames.length > 0) {
//       map.set(category, new Set(selectedSubNames));
//       setAllCheckedByCategory(new Map([[category, false]]));
//     } else {
//       // "All" selected
//       setAllCheckedByCategory(new Map([[category, true]]));
//     }

//     return map;
//   });
// }, [selectedCategory, selectedSubNames, loadSubsByName]);

//   /* ---------------------------------------------
//       CATEGORY: Toggle All
//   ---------------------------------------------- */
//   const toggleAllInCategory = useCallback(
//     async (category, nextChecked) => {
//       setActiveCategory(category);
//       setSelectedSubsByCategory(new Map());
//       setAllCheckedByCategory(new Map([[category, !!nextChecked]]));

//       if (nextChecked) {
//         await loadSubsByName(category);
//         setTimeout(() => {
//   onSelectCategory?.({ name: category });
//   onSelectSubCategory?.({ names: [] }, { name: category });
// }, 0);

//       } else {
//         onSelectCategory?.(null);
//         onSelectSubCategory?.({ names: [] }, { name: category });
//         setActiveCategory(null);
//         setAllCheckedByCategory(new Map());
//       }
//     },
//     [onSelectCategory, onSelectSubCategory, loadSubsByName]
//   );

//   /* ---------------------------------------------
//       SUBCATEGORY: Toggle one
//   ---------------------------------------------- */
//   const toggleSub = useCallback(
//     async (category, sub) => {
//       await loadSubsByName(category);
//       setActiveCategory(category);

//       setSelectedSubsByCategory((prev) => {
//         const next = new Map(prev);
//         const current = new Set(prev.get(category) || []);

//         current.has(sub) ? current.delete(sub) : current.add(sub);

//         if (current.size > 0) next.set(category, current);
//         else next.delete(category);

//         setAllCheckedByCategory(new Map([[category, current.size === 0]]));

//         setTimeout(() => {
//   onSelectCategory?.({ name: category });
//   onSelectSubCategory?.({ names: Array.from(current) }, { name: category });
// }, 0);

//         return next;
//       });
//     },
//     [onSelectCategory, onSelectSubCategory, loadSubsByName]
//   );

//   /* ---------------------------------------------
//       PRICE RANGE
//   ---------------------------------------------- */
//   const handleCustomPriceFilter = () => {
//   const [min, max] = priceRange;

//   if (min > max) {
//     setErrorPrice("Minimum cannot exceed Maximum");
//     return;
//   }

//   setErrorPrice("");
//   setLoadingPrice(true);

//   onPriceFilterChange?.({
//     range: { min, max },
//   });

//   setLoadingPrice(false);
//   setOpenMobile(false);
// };

//   const SquareCheckbox = ({ checked, onChange, label, indeterminate }) => (
//     <label className="flex items-center gap-2 cursor-pointer select-none">
//       <span
//         aria-hidden="true"
//         className={`inline-flex size-4 border rounded-[3px] ${
//           checked ? "border-[#1a4122] bg-[#1a4122]" : "border-gray-300 bg-white"
//         } relative`}
//       >
//         {checked && (
//           <svg className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
//             fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//           </svg>
//         )}
//         {!checked && indeterminate && (
//           <span className="w-2 h-0.5 bg-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
//         )}
//       </span>

//       <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
//       <span className="text-sm text-gray-600">{label}</span>
//     </label>
//   );

//   const visibleCategories = useMemo(() => {
//   if (!urlCategory) return categories;

//   return categories.filter(
//     (cat) =>
//       cat.name.toLowerCase() === decodeURIComponent(urlCategory).toLowerCase()
//   );
// }, [categories, urlCategory]);

//   return (
//     <aside className={`w-full bg-[#f7fff1] rounded-lg border border-gray-200 ${className}`}>
//       {/* HEADER */}
//       <div className="px-3 py-3 border-b border-gray-100 flex items-center justify-between">
//         <div>
//           <h3 className="heading-3 tracking-wide text-gray-700">Filter Options</h3>
//           <p className="text-body text-gray-400 mt-0.5">By Categories & Price</p>
//         </div>
//       </div>

//       {/* BODY */}
//       <div id="sidebar-body" className={`${openMobile ? "block" : "hidden"} lg:block overflow-y-auto`}>
//         {/* CATEGORIES */}
//         <div className="px-3 py-3 border-b border-gray-100">
//           <div className="flex justify-between items-center mb-2">
//           <h3 className="heading-3 tracking-wide text-gray-700 mb-2">Categories</h3>
//           {onClearAll && (

// <button
//   onClick={async () => {
//     // 🔹 CASE 1: Sidebar opened via navbar category
//     if (urlCategory) {
//       const categoryName = decodeURIComponent(urlCategory);

//       // Load subcategories (needed for "All")
//       await loadSubsByName(categoryName);

//       // ✅ Apply category
//       onSelectCategory?.({ name: categoryName });

//       // ✅ Apply "All" (no subcategories selected)
//       onSelectSubCategory?.({ names: [] }, { name: categoryName });

//       // ✅ Reset price only
//       onPriceFilterChange?.(null);

//       // ✅ Update local sidebar UI
//       setActiveCategory(categoryName);
//       setSelectedSubsByCategory(new Map());
//       setAllCheckedByCategory(new Map([[categoryName, true]]));

//       setCustomMinPrice("");
//       setCustomMaxPrice("");
//       setPriceRange([PRICE_MIN, PRICE_MAX]);
//       setErrorPrice("");

//       return;
//     }

//     // 🔹 CASE 2: Normal clear all (existing behavior)
//     onSelectCategory?.(null);
//     onSelectSubCategory?.({ names: [] }, null);
//     onPriceFilterChange?.(null);
//     onClearAll?.();

//     setActiveCategory(null);
//     setSelectedSubsByCategory(new Map());
//     setAllCheckedByCategory(new Map());

//     setCustomMinPrice("");
//     setCustomMaxPrice("");
//     setPriceRange([PRICE_MIN, PRICE_MAX]);
//     setErrorPrice("");
//   }}
//   className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
// >
//   Clear All Filters
// </button>

// )}
// </div>
//           {loadingCats && (
//             <ul className="space-y-2">
//               {[...Array(5)].map((_, i) => (
//                 <li key={i} className="h-3 bg-gray-100 rounded animate-pulse"></li>
//               ))}
//             </ul>
//           )}

//           {!loadingCats && categories.length === 0 && (
//             <p className="text-sm text-gray-500 text-center">No categories found</p>
//           )}

//           {!loadingCats &&
//             visibleCategories.map((cat) => {
//               const catName = cat.name;
//               const subData = getCachedSubcategories(cat._id);
// const subs = getCachedSubcategories(cat._id).map((sc) => sc.name);

// // The correct category name always comes from cat.name
// const displayCategoryName = cat.name;

// // Extract category name from API response

//               const selectedSet = selectedSubsByCategory.get(catName) || new Set();
//               const isActive = activeCategory === catName;

//               const allChecked =
//                 allCheckedByCategory.get(catName) || (isActive && selectedSet.size === 0);

//               const isIndeterminate = !allChecked && selectedSet.size > 0;

//               return (
//                 <li key={cat._id} className="border-b border-gray-100 last:border-b-0 pb-3">
//   <div className="flex items-center justify-between mb-2">
//     <span className="text-sm font-medium text-gray-700">
//       {displayCategoryName}
//     </span>
//     <span className="text-xs text-gray-400">{subs.length}</span>
//   </div>

//   <div className="pl-1 space-y-1.5">
//     <SquareCheckbox
//       checked={allChecked}
//       indeterminate={isIndeterminate}
//       onChange={(next) => toggleAllInCategory(displayCategoryName, next)}
//       label="All"
//     />

//     {subs.map((sub) => (
//       <SquareCheckbox
//         key={sub}
//         checked={selectedSet.has(sub)}
//         onChange={() => toggleSub(displayCategoryName, sub)}
//         label={sub}
//       />
//     ))}
//   </div>
// </li>

//               );
//             })}
//         </div>

//         {/* PRICE */}
//         <div className="px-3 py-3">
//           <div className="border-t border-gray-100 pt-3">
//             <p className="text-body text-gray-700 mb-2">Custom Range</p>

// <div className="px-1 mt-2">
//   <Slider
//     range
//     allowCross={false}
//     min={PRICE_MIN}
//     max={PRICE_MAX}
//     value={priceRange}
//     onChange={(values) => {
//       setPriceRange(values);
//       setCustomMinPrice(values[0]);
//       setCustomMaxPrice(values[1]);
//     }}
//     trackStyle={[{ backgroundColor: "#1a4122" }]}
//     handleStyle={[
//       { borderColor: "#1a4122" },
//       { borderColor: "#1a4122" },
//     ]}
//   />

//   <div className="flex justify-between text-xs text-gray-500 mt-1">
//     <span>₹{priceRange[0]}</span>
//     <span>₹{priceRange[1]}</span>
//   </div>
// </div>

//             <div className="flex gap-2 justify-center items-center">
//               <input
//                 type="number"
//                 placeholder="Min"
//                 value={customMinPrice}
//                 onChange={(e) => {
//   const val = Number(e.target.value) || PRICE_MIN;
//   setCustomMinPrice(val);
//   setPriceRange([val, priceRange[1]]);
// }}

//                 className="w-25 px-2 py-1.5 text-xs border border-gray-300 rounded"
//                 min="0"
//               />

//               <span className="text-xs text-gray-400">-</span>

//               <input
//                 type="number"
//                 placeholder="Max"
//                 value={customMaxPrice}
//                 onChange={(e) => {
//   const val = Number(e.target.value) || PRICE_MAX;
//   setCustomMaxPrice(val);
//   setPriceRange([priceRange[0], val]);
// }}

//                 className="w-25 px-2 py-1.5 text-xs border border-gray-300 rounded"
//                 min="0"
//               />
//             </div>

//             <button
//               onClick={handleCustomPriceFilter}
//               disabled={!customMinPrice && !customMaxPrice}
//               className="w-full mt-2 px-3 py-1.5 text-xs font-medium text-white bg-[#1a4122] rounded"
//             >
//               Apply
//             </button>
//           </div>

//           {loadingPrice && (
//             <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
//               <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-[#1a4122] rounded-full animate-spin"></span>
//               Filtering...
//             </div>
//           )}

//           {!!errorPrice && (
//             <p className="text-body text-red-600 mt-3 p-2 bg-red-50 rounded border border-red-100">
//               {errorPrice}
//             </p>
//           )}
//         </div>

//       </div>

//     </aside>
//   );
// }

// src/components/Sidebar/SidebarCategoriesWithSubs.jsx
// import { useEffect, useMemo, useRef, useState, useCallback } from "react";
// import { useLocation } from "react-router-dom";
// import { useCategories } from "../../hooks/useCategory"; // <-- KEY CHANGE
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";

// export default function SidebarCategoriesWithSubs({
//   className = "",
//   onSelectCategory,
//   onSelectSubCategory,
//   onPriceFilterChange,
//   onClearAll,
//   onCategoriesLoaded,

//   selectedCategory = null,
//   selectedSubNames = [],
//   priceFilter = null,

//   openMobile = true,
//   setOpenMobile,
// }) {
//   const {
//     categories,
//     loading: loadingCats,
//     fetchSubcategories,
//     getCachedSubcategories,
//     isLoadingSubcategories,
//   } = useCategories();

//   const [selectedSubsByCategory, setSelectedSubsByCategory] = useState(
//     () => new Map()
//   );
//   const [allCheckedByCategory, setAllCheckedByCategory] = useState(
//     () => new Map()
//   );
//   const [activeCategory, setActiveCategory] = useState(null);

//   const [customMinPrice, setCustomMinPrice] = useState("");
//   const [customMaxPrice, setCustomMaxPrice] = useState("");
//   const [loadingPrice, setLoadingPrice] = useState(false);
//   const [errorPrice, setErrorPrice] = useState("");
//   const PRICE_MIN = 0;
//   const PRICE_MAX = 2000;

//   const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);

//   const priceAbortRef = useRef(null);
//   const location = useLocation();

//   const searchParams = new URLSearchParams(location.search);
//   const urlCategory = searchParams.get("category");

//   // Reset on route change
//   useEffect(() => {
//     setActiveCategory(null);
//     setSelectedSubsByCategory(new Map());
//     setAllCheckedByCategory(new Map());
//     setCustomMinPrice("");
//     setCustomMaxPrice("");
//     setPriceRange([PRICE_MIN, PRICE_MAX]);
//     setErrorPrice("");
//   }, [location.pathname]);

//   // Notify parent categories loaded
//   useEffect(() => {
//     if (typeof onCategoriesLoaded === "function") {
//       onCategoriesLoaded(categories.map((c) => c.name));
//     }
//   }, [categories, onCategoriesLoaded]);

//   /* ---------------------------------------------
//       Get Category _id and fetch subs once
//   ---------------------------------------------- */
//   const loadSubsByName = useCallback(
//     async (catName) => {
//       const catObj = categories.find((c) => c.name === catName);
//       if (!catObj?._id) return;
//       await fetchSubcategories(catObj._id);
//     },
//     [categories, fetchSubcategories]
//   );

//   /* ---------------------------------------------
//    🔁 SYNC: Parent → Sidebar (AUTO CHECK)
// ---------------------------------------------- */
//   useEffect(() => {
//     if (!selectedCategory?.name) {
//       setSelectedSubsByCategory(new Map());
//       setAllCheckedByCategory(new Map());
//       setActiveCategory(null);
//       return;
//     }

//     const category = selectedCategory.name;
//     setActiveCategory(category);

//     // Load subcategories if not already loaded
//     loadSubsByName(category);

//     setSelectedSubsByCategory(() => {
//       const map = new Map();

//       if (selectedSubNames.length > 0) {
//         map.set(category, new Set(selectedSubNames));
//         setAllCheckedByCategory(new Map([[category, false]]));
//       } else {
//         // "All" selected
//         setAllCheckedByCategory(new Map([[category, true]]));
//       }

//       return map;
//     });
//   }, [selectedCategory, selectedSubNames, loadSubsByName]);

//   /* ---------------------------------------------
//       CATEGORY: Toggle All
//   ---------------------------------------------- */
//   const toggleAllInCategory = useCallback(
//     async (category, nextChecked) => {
//       setActiveCategory(category);
//       setSelectedSubsByCategory(new Map());
//       setAllCheckedByCategory(new Map([[category, !!nextChecked]]));

//       if (nextChecked) {
//         await loadSubsByName(category);
//         setTimeout(() => {
//           onSelectCategory?.({ name: category });
//           onSelectSubCategory?.({ names: [] }, { name: category });
//         }, 0);
//       } else {
//         onSelectCategory?.(null);
//         onSelectSubCategory?.({ names: [] }, { name: category });
//         setActiveCategory(null);
//         setAllCheckedByCategory(new Map());
//       }
//     },
//     [onSelectCategory, onSelectSubCategory, loadSubsByName]
//   );

//   /* ---------------------------------------------
//       SUBCATEGORY: Toggle one
//   ---------------------------------------------- */
//   const toggleSub = useCallback(
//     async (category, sub) => {
//       await loadSubsByName(category);
//       setActiveCategory(category);

//       setSelectedSubsByCategory((prev) => {
//         const next = new Map(prev);
//         const current = new Set(prev.get(category) || []);

//         current.has(sub) ? current.delete(sub) : current.add(sub);

//         if (current.size > 0) next.set(category, current);
//         else next.delete(category);

//         setAllCheckedByCategory(new Map([[category, current.size === 0]]));

//         setTimeout(() => {
//           onSelectCategory?.({ name: category });
//           onSelectSubCategory?.(
//             { names: Array.from(current) },
//             { name: category }
//           );
//         }, 0);

//         return next;
//       });
//     },
//     [onSelectCategory, onSelectSubCategory, loadSubsByName]
//   );

//   /* ---------------------------------------------
//       PRICE RANGE
//   ---------------------------------------------- */
//   const handleCustomPriceFilter = () => {
//     const [min, max] = priceRange;

//     if (min > max) {
//       setErrorPrice("Minimum cannot exceed Maximum");
//       return;
//     }

//     setErrorPrice("");
//     setLoadingPrice(true);

//     onPriceFilterChange?.({
//       range: { min, max },
//     });

//     setLoadingPrice(false);
//     setOpenMobile(false);
//   };

//   const SquareCheckbox = ({ checked, onChange, label, indeterminate }) => (
//     <label className="flex items-center gap-2 cursor-pointer select-none">
//       <span
//         aria-hidden="true"
//         className={`inline-flex size-4 border rounded-[3px] ${
//           checked ? "border-[#1a4122] bg-[#1a4122]" : "border-gray-300 bg-white"
//         } relative`}
//       >
//         {checked && (
//           <svg
//             className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={3}
//               d="M5 13l4 4L19 7"
//             />
//           </svg>
//         )}
//         {!checked && indeterminate && (
//           <span className="w-2 h-0.5 bg-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
//         )}
//       </span>

//       <input
//         type="checkbox"
//         checked={!!checked}
//         onChange={(e) => onChange(e.target.checked)}
//         className="sr-only"
//       />
//       <span className="text-sm text-gray-600">{label}</span>
//     </label>
//   );

//   const visibleCategories = useMemo(() => {
//     if (!urlCategory) return categories;

//     return categories.filter(
//       (cat) =>
//         cat.name.toLowerCase() === decodeURIComponent(urlCategory).toLowerCase()
//     );
//   }, [categories, urlCategory]);

//   return (
//     <aside
//       className={`w-full bg-[#f7fff1] rounded-lg border border-gray-200 ${className}`}
//     >
//       {/* HEADER */}
//       <div className="px-3 py-3 border-b border-gray-100 flex items-center justify-between">
//         <div>
//           <h3 className="heading-3 tracking-wide text-gray-700">
//             Filter Options
//           </h3>
//           <p className="text-body text-gray-400 mt-0.5">
//             By Categories & Price
//           </p>
//         </div>
//       </div>

//       {/* BODY */}
//       <div
//         id="sidebar-body"
//         className={`${
//           openMobile ? "block" : "hidden"
//         } lg:block overflow-y-auto`}
//       >
//         {/* CATEGORIES */}
//         <div className="px-3 py-3 border-b border-gray-100">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="heading-3 tracking-wide text-gray-700 mb-2">
//               Categories
//             </h3>
//             {onClearAll && (
//               <button
//                 onClick={async () => {
//                   // 🔹 CASE 1: Sidebar opened via navbar category
//                   if (urlCategory) {
//                     const categoryName = decodeURIComponent(urlCategory);

//                     // Load subcategories (needed for "All")
//                     await loadSubsByName(categoryName);

//                     // ✅ Apply category
//                     onSelectCategory?.({ name: categoryName });

//                     // ✅ Apply "All" (no subcategories selected)
//                     onSelectSubCategory?.(
//                       { names: [] },
//                       { name: categoryName }
//                     );

//                     // ✅ Reset price only
//                     onPriceFilterChange?.(null);

//                     // ✅ Update local sidebar UI
//                     setActiveCategory(categoryName);
//                     setSelectedSubsByCategory(new Map());
//                     setAllCheckedByCategory(new Map([[categoryName, true]]));

//                     setCustomMinPrice("");
//                     setCustomMaxPrice("");
//                     setPriceRange([PRICE_MIN, PRICE_MAX]);
//                     setErrorPrice("");

//                     return;
//                   }

//                   // 🔹 CASE 2: Normal clear all (existing behavior)
//                   onSelectCategory?.(null);
//                   onSelectSubCategory?.({ names: [] }, null);
//                   onPriceFilterChange?.(null);
//                   onClearAll?.();

//                   setActiveCategory(null);
//                   setSelectedSubsByCategory(new Map());
//                   setAllCheckedByCategory(new Map());

//                   setCustomMinPrice("");
//                   setCustomMaxPrice("");
//                   setPriceRange([PRICE_MIN, PRICE_MAX]);
//                   setErrorPrice("");
//                 }}
//                 className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
//               >
//                 Clear All Filters
//               </button>
//             )}
//           </div>
//           {loadingCats && (
//             <ul className="space-y-2">
//               {[...Array(5)].map((_, i) => (
//                 <li
//                   key={i}
//                   className="h-3 bg-gray-100 rounded animate-pulse"
//                 ></li>
//               ))}
//             </ul>
//           )}

//           {!loadingCats && categories.length === 0 && (
//             <p className="text-sm text-gray-500 text-center">
//               No categories found
//             </p>
//           )}

//           {!loadingCats &&
//             visibleCategories.map((cat) => {
//               const catName = cat.name;
//               const subData = getCachedSubcategories(cat._id);
//               const subs = getCachedSubcategories(cat._id).map((sc) => sc.name);

//               // The correct category name always comes from cat.name
//               const displayCategoryName = cat.name;

//               // Extract category name from API response

//               const selectedSet =
//                 selectedSubsByCategory.get(catName) || new Set();
//               const isActive = activeCategory === catName;

//               const allChecked =
//                 allCheckedByCategory.get(catName) ||
//                 (isActive && selectedSet.size === 0);

//               const isIndeterminate = !allChecked && selectedSet.size > 0;

//               return (
//                 <li
//                   key={cat._id}
//                   className="border-b border-gray-100 last:border-b-0 pb-3"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium text-gray-700">
//                       {displayCategoryName}
//                     </span>
//                     <span className="text-xs text-gray-400">{subs.length}</span>
//                   </div>

//                   <div className="pl-1 space-y-1.5">
//                     <SquareCheckbox
//                       checked={allChecked}
//                       indeterminate={isIndeterminate}
//                       onChange={(next) =>
//                         toggleAllInCategory(displayCategoryName, next)
//                       }
//                       label="All"
//                     />

//                     {subs.map((sub) => (
//                       <SquareCheckbox
//                         key={sub}
//                         checked={selectedSet.has(sub)}
//                         onChange={() => toggleSub(displayCategoryName, sub)}
//                         label={sub}
//                       />
//                     ))}
//                   </div>
//                 </li>
//               );
//             })}
//         </div>

//         {/* PRICE */}
//         <div className="px-3 py-3">
//           <div className="border-t border-gray-100 pt-3">
//             <p className="text-body text-gray-700 mb-2">Custom Range</p>

//             <div className="px-1 mt-2">
//               <Slider
//                 range
//                 allowCross={false}
//                 min={PRICE_MIN}
//                 max={PRICE_MAX}
//                 value={priceRange}
//                 onChange={(values) => {
//                   setPriceRange(values);
//                   setCustomMinPrice(values[0]);
//                   setCustomMaxPrice(values[1]);
//                 }}
//                 trackStyle={[{ backgroundColor: "#1a4122" }]}
//                 handleStyle={[
//                   { borderColor: "#1a4122" },
//                   { borderColor: "#1a4122" },
//                 ]}
//               />

//               <div className="flex justify-between text-xs text-gray-500 mt-1">
//                 <span>₹{priceRange[0]}</span>
//                 <span>₹{priceRange[1]}</span>
//               </div>
//             </div>

//             <div className="flex gap-2 justify-center items-center">
//               <input
//                 type="number"
//                 placeholder="Min"
//                 value={customMinPrice}
//                 onChange={(e) => {
//                   const val = Number(e.target.value) || PRICE_MIN;
//                   setCustomMinPrice(val);
//                   setPriceRange([val, priceRange[1]]);
//                 }}
//                 className="w-25 px-2 py-1.5 text-xs border border-gray-300 rounded"
//                 min="0"
//               />

//               <span className="text-xs text-gray-400">-</span>

//               <input
//                 type="number"
//                 placeholder="Max"
//                 value={customMaxPrice}
//                 onChange={(e) => {
//                   const val = Number(e.target.value) || PRICE_MAX;
//                   setCustomMaxPrice(val);
//                   setPriceRange([priceRange[0], val]);
//                 }}
//                 className="w-25 px-2 py-1.5 text-xs border border-gray-300 rounded"
//                 min="0"
//               />
//             </div>

//             <button
//               onClick={handleCustomPriceFilter}
//               disabled={!customMinPrice && !customMaxPrice}
//               className="w-full mt-2 px-3 py-1.5 text-xs font-medium text-white bg-[#1a4122] rounded"
//             >
//               Apply
//             </button>
//           </div>

//           {loadingPrice && (
//             <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
//               <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-[#1a4122] rounded-full animate-spin"></span>
//               Filtering...
//             </div>
//           )}

//           {!!errorPrice && (
//             <p className="text-body text-red-600 mt-3 p-2 bg-red-50 rounded border border-red-100">
//               {errorPrice}
//             </p>
//           )}
//         </div>
//       </div>
//     </aside>
//   );
// }

import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import useApp from "../../ContextApi/AppContext";
import { RxCross2 } from "react-icons/rx";

export default function SidebarCategoriesWithSubs({
  className = "",
  onSelectCategory,
  onSelectSubCategory,
  onPriceFilterChange,
  onClearAll,
  onCategoriesLoaded,

  selectedCategory = null,
  selectedSubNames = [],
  priceFilter = null,

  openMobile = true,
  setOpenMobile,
}) {
  const { categories: appCategories } = useApp();

  const categories = useMemo(() => {
    return appCategories.map((cat) => ({
      _id: cat._id,
      name: cat.category,
      subCategories: cat.subCategories || [],
    }));
  }, [appCategories]);

  const loadingCats = !appCategories.length;

  const [selectedSubsByCategory, setSelectedSubsByCategory] = useState(
    () => new Map()
  );
  const [allCheckedByCategory, setAllCheckedByCategory] = useState(
    () => new Map()
  );
  const [activeCategory, setActiveCategory] = useState(null);

  const [customMinPrice, setCustomMinPrice] = useState("");
  const [customMaxPrice, setCustomMaxPrice] = useState("");
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [errorPrice, setErrorPrice] = useState("");
  const PRICE_MIN = 0;
  const PRICE_MAX = 2000;

  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const urlCategory = searchParams.get("category");

  // Reset on route change
  useEffect(() => {
    setActiveCategory(null);
    setSelectedSubsByCategory(new Map());
    setAllCheckedByCategory(new Map());
    setCustomMinPrice("");
    setCustomMaxPrice("");
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setErrorPrice("");
  }, [location.pathname]);

  // Notify parent categories loaded
  useEffect(() => {
    if (typeof onCategoriesLoaded === "function") {
      onCategoriesLoaded(categories.map((c) => c.name));
    }
  }, [categories, onCategoriesLoaded]);

  // Parent → Sidebar (AUTO CHECK)
  useEffect(() => {
    if (!selectedCategory?.name) {
      setSelectedSubsByCategory(new Map());
      setAllCheckedByCategory(new Map());
      setActiveCategory(null);
      return;
    }

    const category = selectedCategory.name;
    setActiveCategory(category);

    setSelectedSubsByCategory(() => {
      const map = new Map();

      if (selectedSubNames.length > 0) {
        map.set(category, new Set(selectedSubNames));
        setAllCheckedByCategory(new Map([[category, false]]));
      } else {
        // "All" selected
        setAllCheckedByCategory(new Map([[category, true]]));
      }

      return map;
    });
  }, [selectedCategory, selectedSubNames]);

  //  CATEGORY: Toggle All
  const toggleAllInCategory = useCallback(
    (category, nextChecked) => {
      setActiveCategory(category);
      setSelectedSubsByCategory(new Map());
      setAllCheckedByCategory(new Map([[category, !!nextChecked]]));

      if (nextChecked) {
        onSelectCategory?.({ name: category });
        onSelectSubCategory?.({ names: [] }, { name: category });
      } else {
        onSelectCategory?.(null);
        onSelectSubCategory?.({ names: [] }, { name: category });
        setActiveCategory(null);
        setAllCheckedByCategory(new Map());
      }
    },
    [onSelectCategory, onSelectSubCategory]
  );

  //  SUBCATEGORY: Toggle one
  const toggleSub = useCallback(
    (category, sub) => {
      setActiveCategory(category);

      setSelectedSubsByCategory((prev) => {
        const next = new Map(prev);
        const current = new Set(prev.get(category) || []);

        current.has(sub) ? current.delete(sub) : current.add(sub);

        if (current.size > 0) next.set(category, current);
        else next.delete(category);

        setAllCheckedByCategory(new Map([[category, current.size === 0]]));

        onSelectCategory?.({ name: category });
        onSelectSubCategory?.(
          { names: Array.from(current) },
          { name: category }
        );

        return next;
      });
    },
    [onSelectCategory, onSelectSubCategory]
  );

  //  PRICE RANGE
  const handleCustomPriceFilter = () => {
    const [min, max] = priceRange;

    if (min > max) {
      setErrorPrice("Minimum cannot exceed Maximum");
      return;
    }

    setErrorPrice("");
    setLoadingPrice(true);

    onPriceFilterChange?.({
      range: { min, max },
    });

    setLoadingPrice(false);
    setOpenMobile(false);
  };

  const SquareCheckbox = ({ checked, onChange, label, indeterminate }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span
        aria-hidden="true"
        className={`inline-flex size-4 border rounded-[3px] ${
          checked ? "border-[#1a4122] bg-[#1a4122]" : "border-gray-300 bg-white"
        } relative`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {!checked && indeterminate && (
          <span className="w-2 h-0.5 bg-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
      </span>

      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  );

  const visibleCategories = useMemo(() => {
    if (!urlCategory) return categories;

    return categories.filter(
      (cat) =>
        cat.name.toLowerCase() === decodeURIComponent(urlCategory).toLowerCase()
    );
  }, [categories, urlCategory]);

  return (
    <aside
      className={`w-full bg-[#f7fff1] rounded-lg border border-gray-200 ${className}`}
    >
      <div className="px-2 max-[360px]:pl-8 sm:px-4">
      {/* HEADER */}
      <div className="px-3 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="heading-3 tracking-wide text-gray-700">
            Filter Options
          </h3>
          <p className="text-body text-gray-400 mt-0.5">
            By Categories & Price
          </p>
        </div>
        <RxCross2 size={24} onClick={() => setOpenMobile(false)} className="cursor-pointer text-gray-600" />
      </div>

      {/* BODY */}
      <div
        id="sidebar-body"
        className={`${
          openMobile ? "block" : "hidden"
        } lg:block overflow-y-auto`}
      >
        {/* CATEGORIES */}
        <div className="px-3 py-3 border-b border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h3 className="heading-3 tracking-wide text-gray-700 mb-2">
              Categories
            </h3>
            {onClearAll && (
              <button
                onClick={async () => {
                  //  Sidebar opened via navbar category
                  if (urlCategory) {
                    const categoryName = decodeURIComponent(urlCategory);

                    //  Apply category
                    onSelectCategory?.({ name: categoryName });

                    //  Apply "All" (no subcategories selected)
                    onSelectSubCategory?.(
                      { names: [] },
                      { name: categoryName }
                    );

                    //  Reset price only
                    onPriceFilterChange?.(null);

                    //  Update local sidebar UI
                    setActiveCategory(categoryName);
                    setSelectedSubsByCategory(new Map());
                    setAllCheckedByCategory(new Map([[categoryName, true]]));

                    setCustomMinPrice("");
                    setCustomMaxPrice("");
                    setPriceRange([PRICE_MIN, PRICE_MAX]);
                    setErrorPrice("");

                    return;
                  }

                  //  Normal clear all (existing behavior)
                  onSelectCategory?.(null);
                  onSelectSubCategory?.({ names: [] }, null);
                  onPriceFilterChange?.(null);
                  onClearAll?.();

                  setActiveCategory(null);
                  setSelectedSubsByCategory(new Map());
                  setAllCheckedByCategory(new Map());

                  setCustomMinPrice("");
                  setCustomMaxPrice("");
                  setPriceRange([PRICE_MIN, PRICE_MAX]);
                  setErrorPrice("");
                }}
                className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Clear All Filters
              </button>
            )}
          </div>
          {loadingCats && (
            <ul className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <li
                  key={i}
                  className="h-3 bg-gray-100 rounded animate-pulse"
                ></li>
              ))}
            </ul>
          )}

          {!loadingCats && categories.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              No categories found
            </p>
          )}

          {!loadingCats &&
            visibleCategories.map((cat) => {
              console.log(cat);
              const catName = cat.name;
              const subs = cat.subCategories.map((sc) => sc.subCategory);

              // Extract category name from API response

              const selectedSet =
                selectedSubsByCategory.get(catName) || new Set();
              const isActive = activeCategory === catName;

              const allChecked =
                allCheckedByCategory.get(catName) ||
                (isActive && selectedSet.size === 0);

              const isIndeterminate = !allChecked && selectedSet.size > 0;

              return (
                <li
                  key={cat._id}
                  className="border-b border-gray-100 last:border-b-0 pb-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {catName}
                    </span>
                    <span className="text-xs text-gray-400">{subs.length}</span>
                  </div>

                  <div className="pl-1 space-y-1.5">
                    <SquareCheckbox
                      checked={allChecked}
                      indeterminate={isIndeterminate}
                      onChange={(next) => toggleAllInCategory(catName, next)}
                      label="All"
                    />

                    {subs.map((sub) => (
                      <SquareCheckbox
                        key={sub}
                        checked={selectedSet.has(sub)}
                        onChange={() => toggleSub(catName, sub)}
                        label={sub}
                      />
                    ))}
                  </div>
                </li>
              );
            })}
        </div>

        {/* PRICE */}
        <div className="px-3 py-3">
          <div className="border-t border-gray-100 pt-3">
            <p className="text-body text-gray-700 mb-2">Custom Range</p>

            <div className="px-1 mt-2">
              <Slider
                range
                allowCross={false}
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={priceRange}
                onChange={(values) => {
                  setPriceRange(values);
                  setCustomMinPrice(values[0]);
                  setCustomMaxPrice(values[1]);
                }}
                trackStyle={[{ backgroundColor: "#1a4122" }]}
                handleStyle={[
                  { borderColor: "#1a4122" },
                  { borderColor: "#1a4122" },
                ]}
              />

              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>

            <div className="flex gap-2 justify-center items-center">
              <input
                type="number"
                placeholder="Min"
                value={customMinPrice}
                onChange={(e) => {
                  const val = Number(e.target.value) || PRICE_MIN;
                  setCustomMinPrice(val);
                  setPriceRange([val, priceRange[1]]);
                }}
                className="w-25 px-2 py-1.5 text-xs border border-gray-300 rounded"
                min="0"
              />

              <span className="text-xs text-gray-400">-</span>

              <input
                type="number"
                placeholder="Max"
                value={customMaxPrice}
                onChange={(e) => {
                  const val = Number(e.target.value) || PRICE_MAX;
                  setCustomMaxPrice(val);
                  setPriceRange([priceRange[0], val]);
                }}
                className="w-25 px-2 py-1.5 text-xs border border-gray-300 rounded"
                min="0"
              />
            </div>

            <button
              onClick={handleCustomPriceFilter}
              disabled={!customMinPrice && !customMaxPrice}
              className="w-full mt-2 px-3 py-1.5 text-xs font-medium text-white bg-[#1a4122] rounded"
            >
              Apply
            </button>
          </div>

          {loadingPrice && (
            <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
              <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-[#1a4122] rounded-full animate-spin"></span>
              Filtering...
            </div>
          )}

          {!!errorPrice && (
            <p className="text-body text-red-600 mt-3 p-2 bg-red-50 rounded border border-red-100">
              {errorPrice}
            </p>
          )}
        </div>
      </div>
    </div>
    </aside>
  );
}
