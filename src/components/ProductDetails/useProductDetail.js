import { useEffect, useState } from "react";

export default function useProductDetail(id, fetchFn) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFn(id, controller.signal);
        setProduct(data);
      } catch (e) {
        if (e.name !== "AbortError" && e.name !== "CanceledError") {
          setError(e.message || "Failed to load product.");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [id, fetchFn]);

  return { product, loading, error };
}
