import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import backend from "../../network/backend";
import { useAuth } from "../../ContextApi/AuthContext";
import BlogSkeleton from "./BlogSkeleton";
import BlogCard from "./BlogCard";

export default function BlogSection() {
  const { loading, setLoading, error, setError } = useAuth();
  const [posts, setPosts] = useState([]);

  // Fetch blogs with cache
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await backend.cachedGet("/blog/get", {
          signal: controller.signal,
          staleTime: 60000,
          cacheTime: 300000,
        });
        const items =
          res?.data?.results ||
          res?.data?.items ||
          res?.data?.blogs ||
          res?.data?.data ||
          [];
        setPosts(Array.isArray(items) ? items : []);
      } catch (err) {
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          setError(
            err?.response?.data?.message ||
              "Failed to load blogs. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  // Sort by publishedAt/createdAt desc
  const sorted = useMemo(() => {
    return [...posts].sort((a, b) => {
      const da = new Date(a?.publishedAt || a?.createdAt || 0).getTime();
      const db = new Date(b?.publishedAt || b?.createdAt || 0).getTime();
      return db - da;
    });
  }, [posts]);

  // Optional: limit for homepage
  const visible = useMemo(() => sorted.slice(0, 6), [sorted]);

  return (
    <>
      {error ? (
        <section className="bg-[#FBFAF9] py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-red-800 text-body">
                  Error loading blog posts
                </p>
                <p className="text-red-600 text-body">{error}</p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-[#FBFAF9] pt-26 sm:pt-6 md:pt-2 lg:pt-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-6 text-center">
              <h2 className="gideon-roman text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-900">
                Latest Blog Posts
              </h2>
              <p className="text-gray-600 text-body">
                Insights, tips, and stories from our team
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BlogSkeleton key={i} />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <section className="bg-[#FBFAF9]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                  <p className="text-center text-gray-600 text-body">
                    No blog posts available.
                  </p>
                  <p className="text-body text-center text-gray-600">
                    Coming soon...
                  </p>
                </div>
              </section>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visible.map((post) => (
                  <BlogCard
                    key={post._id || post.id || post.slug}
                    post={post}
                  />
                ))}
              </div>
            )}

            {}
          </div>
        </section>
      )}
    </>
  );
}
