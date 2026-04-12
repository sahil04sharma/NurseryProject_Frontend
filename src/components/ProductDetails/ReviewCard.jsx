import { CheckCircle, Heart } from "lucide-react";
import { useState } from "react";
import StarRating from "../common/StarRating";

const ReviewCard = ({
  review,
  onOpenImages,
  onToggleLike,
  initialLikes,
  initialLiked,
}) => {
  const [liked, setLiked] = useState(Boolean(initialLiked));
  const [likes, setLikes] = useState(Number(initialLikes || 0));
  const [pending, setPending] = useState(false);

  const isMobile = window.innerHeight < 768;

  const handleLike = async (id) => {
    if (pending) return;
    setPending(true);
    const nextLiked = !liked;
    const delta = nextLiked ? 1 : -1;

    // optimistic UI
    setLiked(nextLiked);
    setLikes((c) => Math.max(0, c + delta));

    try {
      const res = await onToggleLike?.(id, nextLiked);
      if (res && typeof res.count === "number") setLikes(res.count);
      if (res && typeof res.likedByMe === "boolean") setLiked(res.likedByMe);
    } catch (err) {
      setLiked(!nextLiked);
      setLikes((c) => Math.max(0, c - delta));
      console.log(
        "Like toggle failed:",
        err?.response?.status,
        err?.response?.data || err?.message
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex gap-2 border-b pb-2">
      {/* Avatar */}
      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600">
        {review.name.charAt(0)}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="flex">
            <StarRating rating={review.rating} size={isMobile ? 14 : 24} />
          </div>

          <span className="text-sm text-gray-500">{review.rating}/5</span>
        </div>

        {/* Verified */}
        <div className="flex items-center gap-1 sm:mt-1 text-xs text-gray-600">
          <CheckCircle size={14} className="text-green-600" />
          <span className="font-medium">Verified</span>
          <span className="font-semibold">{review.name}</span>
        </div>

        {/* Title */}
        <h4 className="font-semibold sm:mt-2 text-gray-900">{review?.title}</h4>

        {/* Description */}
        <p className="text-gray-700 mt-1 line-clamp-3 leading-relaxed">
          {review?.review}
        </p>

        {Array.isArray(review.images) && review.images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {review.images.slice(0, 6).map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onOpenImages(review.images, i)}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden border border-gray-200 hover:border-gray-300 transition"
              >
                <img
                  src={src}
                  alt={`review-${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="mt-1 sm:mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleLike(review.id)}
            className={`inline-flex items-center justify-center rounded-full transition ${
              liked && "bg-white border-gray-200 hover:bg-gray-50"
            } ${pending ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <Heart
              className="transition"
              size={18}
              color={liked ? "#DE291A" : "#9ca3af"}
              fill={liked ? "#DE291B" : "none"}
              strokeWidth={2}
            />
          </button>
          <span className="text-xs text-gray-600">{likes}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
