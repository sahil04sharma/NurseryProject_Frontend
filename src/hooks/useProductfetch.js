import { useEffect, useRef, useReducer, useCallback } from "react";
import { useLocation } from "react-router-dom";
import backend from "../network/backend";

// --- REDUCER CONFIGURATION ---

const ACTION_TYPES = {
  RESET: "RESET",
  HARD_RESET: "HARD_RESET",
  UPDATE_FILTERS: "UPDATE_FILTERS",
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
  HANDLE_SEARCH_TRANSITION: "HANDLE_SEARCH_TRANSITION",
  FETCH_INIT: "FETCH_INIT",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  NEXT_PAGE: "NEXT_PAGE",
  SET_PRODUCTS_MANUAL: "SET_PRODUCTS_MANUAL",
};

const initialState = (initialSearchQuery) => ({
  products: [],
  apiSuccess: true,
  searchPage: 1,
  searchQuery: initialSearchQuery,
  activeFilters: {},
  totalCount: 0,
  // If we start with a query, we are in search mode, otherwise filter mode
  mode: initialSearchQuery ? "search" : "filter",
  isFetching: false,
  hasMore: true,
  searchTrigger: 0,
});

function productReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.RESET: {
      const { keepSearch, keepFilters } = action.payload;
      return {
        ...state,
        products: [],
        searchPage: 1,
        hasMore: true,
        isFetching: false,
        searchQuery: keepSearch ? state.searchQuery : "",
        activeFilters: keepFilters ? state.activeFilters : {},
        mode: keepSearch ? "search" : keepFilters ? "filter" : "normal",
      };
    }

    case ACTION_TYPES.HARD_RESET:
      return {
        ...state,
        products: [],
        searchPage: 1,
        hasMore: true,
        isFetching: false,
      };

    case ACTION_TYPES.UPDATE_FILTERS:
      return {
        ...state,
        // Hard reset logic inline
        products: [],
        searchPage: 1,
        hasMore: true,
        isFetching: false,
        // Update specific fields
        activeFilters: { ...action.payload },
        mode: "filter",
      };

    case ACTION_TYPES.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };

    case ACTION_TYPES.HANDLE_SEARCH_TRANSITION:
      // This handles the complex logic from the search useEffect
      return {
        ...state,
        products: [], // Hard reset
        searchPage: 1,
        hasMore: true,
        isFetching: false,
        mode: action.payload.mode, // 'search' or 'filter'
        searchTrigger: state.searchTrigger + 1, // Force refetch
      };

    case ACTION_TYPES.FETCH_INIT:
      return {
        ...state,
        isFetching: true,
        apiSuccess: true,
      };

    case ACTION_TYPES.FETCH_SUCCESS: {
      const { newProducts, totalCount, hasMore } = action.payload;
      const isFirstPage = state.searchPage === 1;

      return {
        ...state,
        isFetching: false,
        totalCount: totalCount !== undefined ? totalCount : state.totalCount,
        hasMore: hasMore,
        products: isFirstPage
          ? newProducts
          : [...state.products, ...newProducts],
      };
    }

    case ACTION_TYPES.FETCH_ERROR:
      return {
        ...state,
        isFetching: false,
        hasMore: false,
        apiSuccess: false,
        products: [],
        totalCount: 0,
      };

    case ACTION_TYPES.NEXT_PAGE:
      return { ...state, searchPage: state.searchPage + 1 };

    case ACTION_TYPES.SET_PRODUCTS_MANUAL:
      // Handle both value and function updates for setProducts compatibility
      const newValue =
        typeof action.payload === "function"
          ? action.payload(state.products)
          : action.payload;
      return { ...state, products: newValue };

    default:
      return state;
  }
}

// --- HOOK IMPLEMENTATION ---

export default function useProductsFetch({
  limit = 12,
  scrollRef = null,
  loaderRef = null,
  initialSearchQuery = "",
} = {}) {
  // 1. Unified State via useReducer
  const [state, dispatch] = useReducer(
    productReducer,
    initialSearchQuery,
    initialState
  );

  // 2. All useRef hooks (kept separate as they track non-rendering state)
  const fetchingRef = useRef(false);
  const restoredFromStorageRef = useRef(false);
  const totalPagesRef = useRef(1);
  const lastSearchRef = useRef("");
  const abortRef = useRef(null);

  const location = useLocation();

  // Helper: Build Query String
  const buildFilterParams = useCallback(
    (filters, pageNum) => {
      const params = new URLSearchParams();
      params.append("page", pageNum);
      params.append("limit", limit);

      if (filters.category) params.append("category", filters.category);
      if (filters.subCategory?.length)
        params.append("subCategory", filters.subCategory.join(","));
      if (filters.price?.min !== undefined)
        params.append("minPrice", filters.price.min);
      if (filters.price?.max !== undefined)
        params.append("maxPrice", filters.price.max);

      return params.toString();
    },
    [limit]
  );

  // 3. Reset Functions
  const reset = useCallback(
    ({ keepSearch = false, keepFilters = false } = {}) => {
      fetchingRef.current = false;
      dispatch({
        type: ACTION_TYPES.RESET,
        payload: { keepSearch, keepFilters },
      });
    },
    []
  );

  const hardReset = useCallback(() => {
    totalPagesRef.current = 1;
    dispatch({ type: ACTION_TYPES.HARD_RESET });
  }, []);

  // 4. Update Filters
  const updateFilters = useCallback((newFilters) => {
    fetchingRef.current = false;
    totalPagesRef.current = 1;
    // Dispatching this single action replaces the multiple setStates and the useEffect dependency
    dispatch({ type: ACTION_TYPES.UPDATE_FILTERS, payload: newFilters });
  }, []);

  // Compatibility wrapper for setProducts
  const setProducts = useCallback((payload) => {
    dispatch({ type: ACTION_TYPES.SET_PRODUCTS_MANUAL, payload });
  }, []);

  // Compatibility wrapper for setSearchQuery
  const setSearchQuery = useCallback((payload) => {
    dispatch({ type: ACTION_TYPES.SET_SEARCH_QUERY, payload });
  }, []);

  // 5. Route Change Detection
  useEffect(() => {
  const currentPath = location.pathname;
  const lastPath = sessionStorage.getItem("product_last_route");

  if (currentPath === "/products") {
    reset();
  }

  else if (lastPath && lastPath !== currentPath) {
    reset();
  }

  sessionStorage.setItem("product_last_route", currentPath);
}, [location.pathname, reset]);


  // 6. Unified Fetch Function
  const fetchData = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: ACTION_TYPES.FETCH_INIT });

    const currentPage = state.searchPage;

    try {
      let url = "";

      if (state.mode === "search") {
        url = `/filter/search?q=${encodeURIComponent(
          state.searchQuery
        )}&page=${currentPage}&limit=${limit}`;
      } else {
        url = `/item/filter?${buildFilterParams(
          state.activeFilters,
          currentPage
        )}`;
      }

      const { data } = await backend.get(url, { signal: controller.signal });

      // Calculation logic
      const backendTotalPages =
        data?.totalPages ??
        (data?.total
          ? Math.ceil(data.total / limit)
          : data?.count
          ? Math.ceil(data.count / limit)
          : 1);

      totalPagesRef.current = backendTotalPages;

      const incoming =
        data?.items ?? data?.data ?? data?.products ?? data?.results ?? [];

      if (incoming.length === 0) {
        dispatch({
          type: ACTION_TYPES.FETCH_SUCCESS,
          payload: { newProducts: [], totalCount: data?.total, hasMore: false },
        });
      } else {
        const mapped = incoming.map((p) => {
          if (p.plantId) {
            return {
              ...p.plantId,
              id: p._id || p.plantId._id,
              productId: p._id || p.plantId._id,
              price: p.minPrice || p.price || p.plantId.price || 0,
              type: "plant",
              source: "plantModel",
            };
          }
          return {
            ...p,
            id: p._id || p.id,
            productId: p._id || p.id,
            type: "item",
            source: "itemModel",
            price: p.price || p.offerPrice || 0,
          };
        });

        await new Promise((resolve) => setTimeout(resolve, 400));

        // Determine hasMore based on refs which are available here
        const shouldHaveMore = currentPage < totalPagesRef.current;

        dispatch({
          type: ACTION_TYPES.FETCH_SUCCESS,
          payload: {
            newProducts: mapped,
            totalCount: data?.total,
            hasMore: shouldHaveMore,
          },
        });
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;

      const response = err?.response?.data;
      console.log("❌ API ERROR RESPONSE:", response);

      if (response?.success === false) {
        dispatch({ type: ACTION_TYPES.FETCH_ERROR });
      } else {
        // Soft error, just stop loading
        dispatch({
          type: ACTION_TYPES.FETCH_SUCCESS,
          payload: { newProducts: [], hasMore: false },
        });
      }
    }
  }, [
    state.mode,
    state.searchPage,
    limit,
    state.searchQuery,
    state.activeFilters,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // Trigger Fetch
  useEffect(() => {
    fetchData();
  }, [state.searchPage, state.mode, state.activeFilters, state.searchTrigger]);

  // NOTE: The previous useEffect that cleared products on [activeFilters, mode]
  // is REMOVED because `dispatch(UPDATE_FILTERS)` and `HANDLE_SEARCH_TRANSITION`
  // now handle the cleanup atomically.

  // Infinite Scroll Observer
  useEffect(() => {
    if (!loaderRef?.current || !scrollRef?.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          !state.isFetching &&
          state.hasMore &&
          state.searchPage < totalPagesRef.current
        ) {
          dispatch({ type: ACTION_TYPES.NEXT_PAGE });
        }
      },
      {
        root: null,
        rootMargin: "0px 0px 400px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, scrollRef, state.hasMore, state.isFetching, state.searchPage]); // Added deps for safety

  // Search Logic
  useEffect(() => {
    const trimmed = state.searchQuery.trim();

    // No-op if nothing actually changed
    if (trimmed === lastSearchRef.current) return;

    lastSearchRef.current = trimmed;

    // Determine target mode based on string existence
    const newMode = trimmed ? "search" : "filter";

    // Dispatch unified transition (handles reset, mode switch, and trigger)
    dispatch({
      type: ACTION_TYPES.HANDLE_SEARCH_TRANSITION,
      payload: { mode: newMode },
    });
  }, [state.searchQuery]);

  return {
    products: state.products,
    totalCount: state.totalCount,
    setProducts,
    isFetching: state.isFetching,
    hasMore: state.hasMore,
    apiSuccess: state.apiSuccess,
    reset,
    setSearchQuery,
    updateFilters,
    activeFilters: state.activeFilters,
    setRestoredFromStorage: (v) => {
      restoredFromStorageRef.current = !!v;
    },
  };
}
