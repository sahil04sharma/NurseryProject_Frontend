import { Star } from "lucide-react";

export default function StarRating({ rating = 0, size = 16, className = "" }) {
  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length: 5 }, (_, i) => {
        const isFull = i < Math.floor(rating);
        const isHalf = i < rating && i >= Math.floor(rating);

        return (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={
              isFull
                ? "text-green-700 fill-green-700"
                : isHalf
                ? "text-green-700"
                : "text-gray-400"
            }
          />
        );
      })}
    </div>
  );
}
