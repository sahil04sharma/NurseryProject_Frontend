import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import backend from "../../network/backend";
import ReviewImageViewer from "./ReviewImageViewer";
import ReviewCard from "./ReviewCard";

function ClientReview({
  itemId: itemIdProp,
  paramKey = "id",
  autoScrollInterval = 3500,
}) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState([]);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);

  const [page, setPage] = useState(0);
  const timerRef = useRef(null);

  const itemId =
    params?.[paramKey] ||
    params?.id ||
    params?.itemId ||
    searchParams.get(paramKey) ||
    searchParams.get("itemId") ||
    location?.state?.itemId ||
    itemIdProp ||
    "";

  //  normalize
  const normalize = useCallback((arr = []) => {
    return arr.map((r, idx) => ({
      id: r._id ?? r.id ?? `rating-${idx}`,
      name: r.userId?.name || r.user?.name || r.username || "Anonymous",
      rating: typeof r.rating === "number" ? r.rating : 0,
      review: r.feedback ?? r.comment ?? r.text ?? "No feedback provided.",
      subtitle: r.userId?.role || r.user?.role || "",
      images: Array.isArray(r.ratingImg) ? r.ratingImg.filter(Boolean) : [],
      likes: Array.isArray(r.likes) ? r.likes.length : 0,
      likedByMe: Boolean(r.likedByMe),
    }));
  }, []);

  // fetch reviews
  useEffect(() => {
    if (!itemId) return;

    let alive = true;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const res = await backend.get(`/rating/get-item/${itemId}`);
        const root = res?.data;

        const list =
          root?.ratings || root?.data?.ratings || root?.data || root || [];

        if (!alive) return;

        setReviews(normalize(Array.isArray(list) ? list : []));
        setLoading(false);
      } catch (e) {
        if (!alive) return;
        setError(e?.response?.data?.message || "Failed to load reviews.");
        setReviews([]);
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [itemId, normalize]);

  // pagination
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(reviews.length / pageSize));

  const visible = useMemo(() => {
    const start = (page % totalPages) * pageSize;
    return reviews.slice(start, start + pageSize);
  }, [reviews, page, totalPages]);

  const shouldAutoScroll = reviews.length > pageSize;

  useEffect(() => {
    if (!shouldAutoScroll) return;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setPage((p) => (p + 1) % totalPages),
      autoScrollInterval
    );

    return () => clearInterval(timerRef.current);
  }, [shouldAutoScroll, totalPages, autoScrollInterval]);

  // image viewer
  const openViewer = (images, start = 0) => {
    if (!images?.length) return;
    setViewerImages(images);
    setViewerStartIndex(start);
    setViewerOpen(true);
  };

  const rotatedImages = viewerOpen
    ? [
        ...viewerImages.slice(viewerStartIndex),
        ...viewerImages.slice(0, viewerStartIndex),
      ]
    : [];

  //  like handler
  const toggleLikeOnServer = async (ratingId) => {
    try {
      const res = await backend.post(`/rating/like/${ratingId}`);
      console.log(res.data);
      console.log(reviews);
      setReviews((prev) =>
        prev.map((r) =>
          r.id === ratingId
            ? {
                ...r,
                likes: res.data.likesCount,
                likedByMe: r.likedByMe,
              }
            : r
        )
      );

      return res.data;
    } catch (e) {
      console.log(
        "LIKE FAIL",
        `/rating/like/${ratingId}`,
        e?.response?.status,
        e?.response?.data || e?.message
      );
      throw e;
    }
  };

  if (!reviews.length && !loading) return null;

  return (
    <div className="lg:mx-20 mt-8">
      <div className="p-6 bg-white">
        <div className="text-center mb-6">
          <h4 className="roboto-serif text-xl font-semibold text-gray-700 sm:text-3xl">
            Ratings & Reviews
          </h4>
        </div>

        {loading && (
          <p className="text-sm text-gray-500 text-center">Loading reviews…</p>
        )}
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        {!loading && reviews.length > 0 && (
          <>
            <div className="grid gap-4">
              {visible.map((r) => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  initialLikes={r.likes}
                  initialLiked={r.likedByMe}
                  onOpenImages={openViewer}
                  onToggleLike={toggleLikeOnServer}
                />
              ))}
            </div>

            {shouldAutoScroll && (
              <div className="mt-3 flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === page % totalPages ? "bg-gray-800" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {viewerOpen && (
          <ReviewImageViewer
            images={rotatedImages}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default ClientReview;
