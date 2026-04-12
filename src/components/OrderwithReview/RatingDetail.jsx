import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useOrder } from "../../ContextApi/OrderContext";
import backend from "../../network/backend";
import { toast } from "react-toastify";
import StarRating from "../common/StarRating";

export default function RatingDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrder();

  const [reviews, setReviews] = useState({});
  const [order, setOrder] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [existingImages, setExistingImages] = useState({});

  /* Fetch ratings */
  const fetchUserRatings = useCallback(async () => {
    try {
      const { data } = await backend.get("/rating/get-user");
      setRatings(data?.data || []);
    } catch (err) {
      console.error("Error fetching ratings", err);
    }
  }, []);

  /* Assign order */
  useEffect(() => {
    if (!orders.length) return;
    setOrder(orders.find((o) => o._id === orderId) || null);
  }, [orders, orderId]);

  /* Load ratings */
  useEffect(() => {
    fetchUserRatings();
  }, [fetchUserRatings]);

  /* Rated items mapping */
  const ratedItems = useMemo(() => {
    if (!order) return [];

    const extractId = (det) =>
      det?._id || det?.plant?._id || det?.pot?._id || null;

    return ratings
      .filter((r) =>
        order.orderItems.some(
          (item) => extractId(item.details) === r.itemId._id
        )
      )
      .map((r) => ({
        itemId: r.itemId._id,
        _id: r._id,
        rating: r.rating,
        feedback: r.feedback,
        bannerImg: Array.isArray(r.bannerImg)
          ? r.bannerImg
          : r.bannerImg
          ? [r.bannerImg]
          : [],
      }));
  }, [order, ratings]);

  /* Prefill */
  useEffect(() => {
    if (!ratedItems.length) return;

    const prefillReviews = {};
    const prefillImages = {};

    ratedItems.forEach((item) => {
      prefillReviews[item.itemId] = {
        rating: item.rating,
        feedback: item.feedback,
        images: [],
      };
      prefillImages[item.itemId] = item.bannerImg;
    });

    setReviews(prefillReviews);
    setExistingImages(prefillImages);
  }, [ratedItems]);

  /* Review helpers */
  const updateReviewField = (productId, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        rating: prev[productId]?.rating ?? 0,
        feedback: prev[productId]?.feedback ?? "",
        images: prev[productId]?.images ?? [],
        [field]: value,
      },
    }));
  };

  const handleRating = (id, rate) => updateReviewField(id, "rating", rate);
  const handleCommentChange = (id, val) =>
    updateReviewField(id, "feedback", val);
  const handleImageUpload = (id, files) =>
    updateReviewField(id, "images", Array.from(files));

  const removeExistingImg = (productId, index) => {
    setExistingImages((prev) => {
      const updated = [...(prev[productId] || [])];
      updated.splice(index, 1);
      return { ...prev, [productId]: updated };
    });
  };

  /* Submit new review */
  const handleReviewSubmit = async (productId) => {
    const review = reviews[productId];
    if (!review?.rating || !review?.feedback)
      return toast.warn("Please provide rating and feedback.");

    try {
      const form = new FormData();
      form.append("itemId", productId);
      form.append("orderId", order._id);
      form.append("rating", review.rating);
      form.append("feedback", review.feedback);
      review.images?.forEach((f) => form.append("banner", f));

      await backend.post("/rating/add", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Review submitted!");
      await fetchUserRatings();
      navigate("/my-profile/my-ratings");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submit failed");
    }
  };

  /* Update existing review */
  const handleReviewUpdate = async (productId, ratingId) => {
    const existingRating = ratedItems.find((r) => r.itemId === productId);

    const review = reviews[productId] || {
      rating: existingRating?.rating || 0,
      feedback: existingRating?.feedback || "",
      images: [],
    };

    try {
      const form = new FormData();
      form.append("rating", review.rating);
      form.append("feedback", review.feedback);
      review.images?.forEach((f) => form.append("banner", f));
      form.append(
        "existingImages",
        JSON.stringify(existingImages[productId] || [])
      );

      await backend.post(`/rating/edit/${ratingId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Review updated!");
      await fetchUserRatings();
      navigate("/my-profile/my-ratings");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  /* If no order */
  if (!order)
    return (
      <div className="p-4 text-center min-h-screen flex items-center justify-center text-2xl text-gray-600">
        Order not found.
      </div>
    );

  const extractProductId = (details) =>
    details?._id || details?.plant?._id || details?.pot?._id;

  /* Star Component */
  function SharpStar({ filled, onClick, testid }) {
    return (
      <svg
        role="button"
        aria-label={`star-${filled ? "filled" : "empty"}`}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={filled ? "#F59E0B" : "none"}
        stroke={filled ? "#F59E0B" : "#D1D5DB"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="miter"
        className="star-icon cursor-pointer"
        onClick={onClick}
        data-testid={testid}
      >
        <path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21L12 17.77L6.82 21L8 14.14L3 9.27L9.91 8.26L12 2Z" />
      </svg>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="text-md text-green-700 hover:underline mb-4 cursor-pointer flex items-center gap-1"
      >
        ← Back to Orders
      </button>

      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Manage/Add Review
        </h3>

        <div className="space-y-6">
          {order.orderItems.map((item) => {
            const id = extractProductId(item.details);
            const existingRating = ratedItems.find((x) => x.itemId === id);
            const isRated = !!existingRating;

            const product = {
              id,
              name:
                item?.details?.name ||
                item?.details?.plant?.name ||
                item?.details?.pot?.name ||
                "Unnamed Product",
              image:
                item?.details?.bannerImg?.[0] ||
                item?.details?.plant?.bannerImg?.[0] ||
                item?.details?.pot?.bannerImg?.[0],
            };

            return (
              <div
                key={id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      Order ID: {order._id}
                    </p>

                    {order.shipmentStatus === "delivered" && (
                      <div className="mt-4">
                        {/* Stars */}
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const currentRating =
                              reviews[id]?.rating !== undefined
                                ? reviews[id].rating
                                : existingRating?.rating || 0;

                            return (
                              <>
                                <SharpStar
                                  key={star}
                                  filled={currentRating >= star}
                                  onClick={() => handleRating(id, star)}
                                  testid={`star-${id}-${star}`}
                                />
                               
                              </>
                            );
                          })}
                        </div>

                        {/* Feedback */}
                        <textarea
                          rows={3}
                          placeholder="Write your feedback..."
                          value={
                            reviews[id]?.feedback ||
                            existingRating?.feedback ||
                            ""
                          }
                          onChange={(e) =>
                            handleCommentChange(id, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        />

                        {/* Image Upload */}
                        <div className="mt-2">
                          <label
                            htmlFor={`file-${id}`}
                            className="text-sm font-semibold"
                          >
                            Upload Images
                          </label>

                          <input
                            id={`file-${id}`}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                              handleImageUpload(id, e.target.files)
                            }
                            className="mt-1 block w-full text-sm border rounded-lg p-1"
                            data-testid={`fileinput-${id}`}
                          />

                          <div className="flex flex-wrap gap-2 mt-2">
                            {/* Existing Images */}
                            {existingImages[id]?.map((url, i) => (
                              <div key={i} className="relative">
                                <img
                                  src={url}
                                  className="w-20 h-20 rounded-lg border"
                                />
                                <button
                                  type="button"
                                  className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full text-xs px-1"
                                  data-testid={`remove-existing-${id}-${i}`}
                                  onClick={() => removeExistingImg(id, i)}
                                >
                                  ×
                                </button>
                              </div>
                            ))}

                            {/* New Images */}
                            {reviews[id]?.images?.map((file, i) => (
                              <div key={i} className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt="new preview"
                                  className="w-20 h-20 rounded-lg border"
                                />
                                <button
                                  type="button"
                                  className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full text-xs px-1"
                                  data-testid={`remove-new-${id}-${i}`}
                                  onClick={() => {
                                    const newImgs = [...reviews[id].images];
                                    newImgs.splice(i, 1);
                                    updateReviewField(id, "images", newImgs);
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Submit / Update Buttons */}
                        <div className="flex gap-2 mt-2">
                          {isRated ? (
                            <button
                              onClick={() =>
                                handleReviewUpdate(id, existingRating._id)
                              }
                              className="px-4 py-1.5 bg-[#1a4122] text-white rounded-lg text-sm font-medium"
                            >
                              Update Review
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReviewSubmit(id)}
                              className="px-4 py-1.5 bg-[#1a4122] text-white rounded-lg text-sm font-medium"
                            >
                              Submit Review
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
