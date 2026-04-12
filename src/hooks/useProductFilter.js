import { useCallback, useEffect, useState } from "react";

/**
 * useProductFilters
 * - Manages the state of selected filters (Category, Subcategory, Price).
 * - Syncs state to localStorage for persistence.
 * - DOES NOT call the API directly (separation of concerns).
 * - The parent component (ProductsPage) listens to these values and triggers the API fetch.
 */
export default function useProductFilters() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubNames, setSelectedSubNames] = useState([]);
  const [priceFilter, setPriceFilter] = useState(null);

  // 1. Restore from localStorage on mount
  useEffect(() => {
    try {
      const savedCat = JSON.parse(localStorage.getItem("selectedCategory"));
      const savedSubs = JSON.parse(localStorage.getItem("selectedSubNames"));
      const savedPrice = JSON.parse(localStorage.getItem("priceFilter"));

      if (savedCat) setSelectedCategory(savedCat);
      if (Array.isArray(savedSubs)) setSelectedSubNames(savedSubs);
      if (savedPrice?.range) setPriceFilter(savedPrice);
    } catch (e) {
      console.warn("Filter restore failed", e);
    }
  }, []);

  // 2. Persist to localStorage whenever state changes
  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem("selectedCategory", JSON.stringify(selectedCategory));
    } else {
      localStorage.removeItem("selectedCategory");
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubNames.length > 0) {
      localStorage.setItem("selectedSubNames", JSON.stringify(selectedSubNames));
    } else {
      localStorage.removeItem("selectedSubNames");
    }
  }, [selectedSubNames]);

  useEffect(() => {
    if (priceFilter) {
      localStorage.setItem("priceFilter", JSON.stringify(priceFilter));
    } else {
      localStorage.removeItem("priceFilter");
    }
  }, [priceFilter]);

  // 3. Handlers
  const handleSelectCategory = useCallback((cat) => {
    // If selecting a category object
    if (cat?.name) {
      setSelectedCategory(cat);
      // When category changes, usually subcategories should reset unless logic dictates otherwise
      setSelectedSubNames([]); 
    } else {
      setSelectedCategory(null);
      setSelectedSubNames([]);
    }
  }, []);

  const handleSelectSubCategory = useCallback((subPayload, cat) => {
    const names = subPayload?.names || [];
    setSelectedSubNames(names);
    
    // Auto-select parent category if provided
    if (cat) {
      setSelectedCategory(cat);
    }
  }, []);

  const handlePriceFilter = useCallback((filterData) => {
    if (filterData?.range) {
      setPriceFilter(filterData);
    } else {
      setPriceFilter(null);
    }
  }, []);

  const removeCat = useCallback(() => {
    setSelectedCategory(null);
    setSelectedSubNames([]);
  }, []);

  const removeSub = useCallback(() => {
    setSelectedSubNames([]);
  }, []);

  const removePrice = useCallback(() => {
    setPriceFilter(null);
  }, []);

  const clearAll = useCallback(() => {
    setSelectedCategory(null);
    setSelectedSubNames([]);
    setPriceFilter(null);
    
    // Clear storage immediately to prevent flicker on reload
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("selectedSubNames");
    localStorage.removeItem("priceFilter");
  }, []);

  return {
    // State
    selectedCategory,
    selectedSubNames,
    priceFilter,
    
    // Handlers
    handleSelectCategory,
    handleSelectSubCategory,
    handlePriceFilter,
    
    // Removers
    removeCat,
    removeSub,
    removePrice,
    clearAll,
  };
}
