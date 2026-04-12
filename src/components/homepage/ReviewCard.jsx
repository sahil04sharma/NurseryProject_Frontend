import React from "react";
import { Calendar, CheckCircle } from "lucide-react";
import StarRating from "../common/StarRating";

const ReviewCard = ({ review }) => {
  const { title, dateText, user, rating, description } = review || {};

  return (
    <div className="group rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200 flex flex-col p-5 min-h-[200px]">
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{dateText || "—"}</span>
        </div>
        <StarRating rating={rating} /> {rating}/5
      </div>

      <div className="text-lg md:text-xl roboto-serif">{title}</div>

      {user && (
        <div className="text-xs flex items-center gap-1 text-gray-600 mb-2">
          <div className=" h-6 w-6 sm:w-8 sm:h-8 rounded-full">
            <img src={user?.image} alt="" className="w-full h-full rounded-full object-cover" />
          </div>
          By <span className="font-medium roboto-serif">{user?.name}</span>
        </div>
      )}
      <p className="text-sm text-gray-600 line-clamp-3 roboto-serif">
        {description}
      </p>
    </div>
  );
};

export default ReviewCard;
