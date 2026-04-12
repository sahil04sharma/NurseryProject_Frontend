import axios from "axios";
import { toast } from "react-toastify";

const backend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL || "https://plantsproject-5dkq.onrender.com/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
// Cache system
const cache = new Map();
const DEFAULT_STALE_TIME = 30 * 1000; // 30 seconds
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

function setCache(key, data, cacheTime) {
  if (cache.has(key)) clearTimeout(cache.get(key).timeout);
  cache.set(key, {
    data,
    timestamp: Date.now(),
    timeout: setTimeout(() => cache.delete(key), cacheTime),
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryRequest(
  error,
  originalRequest,
  baseDelay = 200,
  maxRetries = 3
) {
  if (!originalRequest) return Promise.reject(error);
  originalRequest._retrying = originalRequest._retrying || 0;
  if (originalRequest._retrying >= maxRetries) return Promise.reject(error);
  originalRequest._retrying += 1;
  const delay = baseDelay * Math.pow(2, originalRequest._retrying - 1);

  if (import.meta.env.DEV) {
    console.log(
      `🔄 Retrying request (attempt ${originalRequest._retrying}/${maxRetries}) after ${delay}ms`
    );
  }

  await wait(delay);
  return backend(originalRequest);
}

// Request Interceptor
backend.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(
        `📡 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`
      );
    }

    // Remove authorization header if it exists
    if (config.headers.Authorization) {
      delete config.headers.Authorization;
    }
    if (config.headers.authorization) {
      delete config.headers.authorization;
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
backend.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ Response: ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  async (error) => {
    if (!error || !error.config) {
      console.error("❌ Unknown error:", error);
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response?.status;

    if (import.meta.env.DEV) {
      console.error(
        `❌ API Error: ${status} - ${originalRequest.url}`,
        error.response?.data
      );
    }

    // Handle 401 Unauthorized - Token Refresh
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (import.meta.env.DEV) {
          console.log("🔄 Attempting token refresh...");
        }

        await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (import.meta.env.DEV) {
          console.log("✅ Token refreshed successfully");
        }

        return backend(originalRequest);
      } catch (refreshError) {
        // console.error("❌ Token refresh failed:", refreshError);

        // toast.error("Session expired. Please login again.");

        // Redirect to login
        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 150000000);

        return Promise.reject(refreshError);
      }
    }

    // Handle server errors and rate limiting with retry
    if (status >= 500 || status === 429) {
      if (status === 429) {
        toast.warning("Too many requests. Retrying...");
      }
      return retryRequest(error, originalRequest);
    }

    // Handle other common errors
    if (status === 403) {
      toast.error(
        error.response?.data?.message ||
          "Access forbidden. You don't have permission."
      );
    } else if (status === 404) {
      toast.error(error.response?.data?.message || "Resource not found.");
    } else if (status >= 400 && status < 500) {
      toast.error(error.response?.data?.message || "Request failed");
    }

    return Promise.reject(error);
  }
);

// Cached GET method
backend.cachedGet = async function (
  url,
  { staleTime = DEFAULT_STALE_TIME, cacheTime = DEFAULT_CACHE_TIME } = {}
) {
  const cached = cache.get(url);

  // Return fresh cache if available and not stale
  if (cached && Date.now() - cached.timestamp < staleTime) {
    if (import.meta.env.DEV) {
      console.log(`💾 Cache hit: ${url}`);
    }
    return cached.data;
  }

  // Return stale cache while fetching fresh data in background
  if (cached) {
    if (import.meta.env.DEV) {
      console.log(`♻️ Stale cache, fetching fresh: ${url}`);
    }

    backend
      .get(url)
      .then((data) => {
        setCache(url, data, cacheTime);
        if (import.meta.env.DEV) {
          console.log(`✅ Cache updated: ${url}`);
        }
      })
      .catch((err) => {
        console.warn(`⚠️ Failed to refresh cache for ${url}:`, err);
      });

    return cached.data;
  }

  // No cache, fetch fresh
  if (import.meta.env.DEV) {
    console.log(`🌐 Fetching fresh: ${url}`);
  }

  const data = await backend.get(url);
  setCache(url, data, cacheTime);
  return data;
};

// Auto-invalidate cache on mutations
const mutationMethods = ["post", "put", "patch", "delete"];

mutationMethods.forEach((method) => {
  const original = backend[method];

  backend[method] = async function (url, ...args) {
    const result = await original.call(backend, url, ...args);

    // Invalidate related GET caches
    const relatedGetUrl = url.split("?")[0];
    const cachedKeys = Array.from(cache.keys()).filter((key) =>
      key.includes(relatedGetUrl)
    );

    if (cachedKeys.length > 0 && import.meta.env.DEV) {
      console.log(
        `🗑️ Invalidating ${cachedKeys.length} related caches for: ${relatedGetUrl}`
      );
    }

    cachedKeys.forEach(async (key) => {
      try {
        const freshData = await backend.get(key);
        setCache(key, freshData, DEFAULT_CACHE_TIME);
        if (import.meta.env.DEV) {
          console.log(`✅ Auto-updated cache: ${key}`);
        }
      } catch (e) {
        console.warn(`⚠️ Failed to update cache for: ${key}`, e);
        cache.delete(key); // Remove stale cache on error
      }
    });

    return result;
  };
});

// Manual cache clearing utility
backend.clearCache = (urlPattern) => {
  if (!urlPattern) {
    cache.clear();
    if (import.meta.env.DEV) {
      console.log("🗑️ All cache cleared");
    }
    return;
  }

  const keysToDelete = Array.from(cache.keys()).filter((key) =>
    key.includes(urlPattern)
  );

  keysToDelete.forEach((key) => cache.delete(key));

  if (import.meta.env.DEV) {
    console.log(
      `🗑️ Cleared ${keysToDelete.length} cache entries matching: ${urlPattern}`
    );
  }
};

export default backend;
