import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useOrder } from "../../ContextApi/OrderContext";
import backend from "../../network/backend";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useCallback } from "react";
import { useAuth } from "../../ContextApi/AuthContext";
import {
  convertMultipleToWebP,
  convertSingleToWebP,
} from "../../helper/convertToWebP";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrder();
  const { loading, setLoading } = useAuth();
  const [reviews, setReviews] = useState({});
  const [order, setOrder] = useState();
  const [ratings, setRatings] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const fetchUserRatings = useCallback(async () => {
    try {
      const { data } = await backend.get("/rating/get-user");
      setRatings(data.data || []);
    } catch (error) {
      console.error("Failed to fetch ratings", error);
    }
  }, []);

  useEffect(() => {
    if (!orders.length) return;
    const found = orders.find((o) => o._id === orderId);
    setOrder(found || null);
  }, [orderId, orders]);

  useEffect(() => {
    fetchUserRatings();
  }, []);

  // Filtering Rated Items
  const ratedItems = useMemo(() => {
    if (!order) return [];
    return ratings
      .filter((r) =>
        order.orderItems.some(
          (item) =>
            (item?.details?._id ||
              item?.details?.plant?._id ||
              item?.details?.pot?._id) === r.itemId._id
        )
      )
      .map((r) => ({
        itemId: r.itemId._id,
        _id: r._id,
        ratings: r.rating,
        feedback: r.feedback,
      }));
  }, [order, ratings]);

  const updateReviewField = (productId, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), [field]: value },
    }));
  };

  const handleRating = (id, r) => updateReviewField(id, "rating", r);

  const handleCommentChange = (id, val) =>
    updateReviewField(id, "feedback", val);

  const handleImageUpload = async (id, files) => {
    if (!files.length) return;
    let compressed =
      files.length === 1
        ? await convertSingleToWebP(files?.[0])
        : await convertMultipleToWebP(files);

    updateReviewField(id, "images", Array.from(compressed));
  };

  // Remove a selected image before submit
  const removeSelectedImage = (productId, index) => {
    setReviews((prev) => {
      const updatedImages = [...(prev[productId]?.images || [])];
      updatedImages.splice(index, 1);
      return {
        ...prev,
        [productId]: {
          ...(prev[productId] || {}),
          images: updatedImages,
        },
      };
    });
  };

  const handleReviewSubmit = async (productId) => {
    const review = reviews[productId];
    if (!review?.rating || !review?.feedback) {
      toast.warn("Please rating and feedback before submitting.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("itemId", productId);
      formData.append("rating", review.rating);
      formData.append("feedback", review.feedback);
      formData.append("orderId", orderId);
      (review.images || []).forEach((file) => {
        formData.append("banner", file);
      });

      await backend.post("/rating/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchUserRatings();
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error?.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewUpdate = async (productId, ratingId) => {
    const review = reviews[productId];
    if (!review?.rating || !review?.feedback) {
      toast.warn("Please provide both rating and feedback before updating.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("rating", review.rating);
      formData.append("feedback", review.feedback);
      formData.append("orderId", orderId);
      (review.images || []).forEach((file) => {
        formData.append("banner", file);
      });

      await backend.post(`/rating/edit/${ratingId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Review updated successfully!");
      await fetchUserRatings();
      setEditingItemId(null);
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(error?.response?.data?.message || "Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    try {
      await backend.post(`/rating/delete/${ratingId}`);
      await fetchUserRatings();
      toast.success("Rating deleted successfully");
    } catch (error) {}
    console.error("Error deleting review:", error);
    toast.error(error?.response?.data?.message || "Failed to Delete review");
  };

  if (!order)
    return (
      <div className="p-4 text-center min-h-screen flex items-center justify-center text-2xl text-gray-600">
        Order not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="text-xs md:text-sm pl-6 sm:pl-0 text-green-700 hover:underline mb-4 cursor-pointer flex items-center gap-1"
      >
        ← Back to Orders
      </button>

      {/* --- ORDER SUMMARY --- */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-2 md:mb-4">
        <h3 className="text-xs lg:text-lg font-bold text-gray-800">
          Order ID - <span>{order._id}</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-2 text-gray-700 text-xs sm:text-sm">
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs md:text-sm font-medium ${
                order.shipmentStatus.toLowerCase() === "delivered"
                  ? "bg-green-100 text-green-700"
                  : order.shipmentStatus.toLowerCase() === "shipped"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.shipmentStatus}
            </span>
          </p>

          <p>
            <span className="font-semibold">Placed On:</span>{" "}
            {order?.createdAt
              ? new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "medium",
                }).format(new Date(order.createdAt))
              : "—"}
          </p>

          <p>
            <span className="font-semibold">Delivery Address:</span>{" "}
            {order?.shippingAddress?.street}, {order?.shippingAddress?.landmark}
            ,{order?.shippingAddress?.city}, {order?.shippingAddress?.state},{" "}
            {order?.shippingAddress?.postalCode},{" "}
            {order?.shippingAddress?.phoneNumber}
          </p>
          <p>
            <span className="font-semibold">Payment Method:</span>{" "}
            {order?.paymentMethod}
          </p>

          <p className="sm:col-span-2 font-semibold">
            Total:{" "}
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(order.totalPrice)}
          </p>
        </div>
      </div>

      {/* --- PRODUCTS --- */}
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h3 className="text-sm sm:text-lg md:text-xl font-bold text-gray-800 mb-4">
          Products in this Order
        </h3>

        <div className="space-y-6">
          {order?.orderItems &&
            order?.orderItems.map((item) => {
              // Items details to Display
              const itemDetails = {
                _id:
                  item?._id ||
                  item?.details?._id ||
                  item?.details?.plant?._id ||
                  item?.details?.pot?._id,
                quantity: item.quantity,
                price: item.price,
                name:
                  item?.name ||
                  item?.details?.name ||
                  item?.details?.plant?.name ||
                  item?.details?.pot?.name ||
                  "Unnamed Product",
                displayImage:
                  item?.bannerImg?.[0] ||
                  item?.details?.bannerImg?.[0] ||
                  item?.details?.plant?.bannerImg?.[0] ||
                  item?.details?.pot?.bannerImg?.[0],
                color: item?.selectedColor,
                size: item?.selectedSize,
              };

              const existingRating = ratedItems.find(
                (r) => r.itemId === itemDetails._id
              );

              const isAlreadyRated = !!existingRating;

              return (
                <div
                  key={itemDetails._id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                >
                  <div className="flex gap-4">
                    <img
                      src={itemDetails.displayImage}
                      alt={itemDetails.name}
                      className="w-12 h-12 md:w-20 md:h-20 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between gap-0.5">
                        <div className="text-xs">
                          <p className="font-medium text-gray-800">
                            {itemDetails.name}
                          </p>
                          <div className="flex text-gray-600">
                            <p className="text-[10px] sm:text-sm text-gray-600">
                              {itemDetails.color &&
                                `Color: ${itemDetails.color}`}

                              {itemDetails.size &&
                                ` | Size: ${itemDetails?.size}`}

                              {itemDetails.quantity &&
                                ` | Qty: ${item.quantity}`}

                              {itemDetails?.price && ` | ₹ ${item.price}`}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            navigate(`/support/chat?itemId=${order._id}`)
                          }
                          className="px-2 py-0 md:px-4 md:py-1 w-full sm:w-fit h-full text-xs md:text-sm  bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 cursor-pointer"
                        >
                          Support
                        </button>
                      </div>

                      {order.shipmentStatus.toLowerCase() === "delivered" && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            Your Review
                          </p>

                          {/* ✅ Already rated section */}
                          {isAlreadyRated &&
                          editingItemId !== itemDetails._id ? (
                            <div className="bg-gray-50 p-3 rounded-lg border text-xs">
                              <div className="flex items-center gap-1 mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 sm:w-5 sm:h-5 ${
                                      existingRating.ratings >= star
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-700 italic text-[10px] sm:text-sm">
                                "{existingRating.feedback}"
                              </p>
                              <div className="flex gap-2">
                                <button
                                  disabled={loading}
                                  onClick={() =>
                                    setEditingItemId(itemDetails._id)
                                  }
                                  className="mt-2 text-[10px] sm:text-sm text-green-700 hover:underline cursor-pointer"
                                >
                                  {loading ? "" : "Update "}
                                </button>
                                <button
                                  disabled={loading}
                                  onClick={() =>
                                    setDeleteDialog(existingRating._id)
                                  }
                                  className="mt-2 text-[10px] sm:text-sm text-red-700 hover:underline cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* ✅ Rating stars */}
                              <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 cursor-pointer transition ${
                                      (isAlreadyRated
                                        ? reviews[itemDetails._id]?.rating ??
                                          existingRating?.ratings
                                        : reviews[itemDetails._id]?.rating) >=
                                      star
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    onClick={() =>
                                      handleRating(itemDetails._id, star)
                                    }
                                  />
                                ))}
                              </div>

                              {/* ✅ Feedback textarea */}
                              <textarea
                                rows={3}
                                placeholder="Write your feedback..."
                                value={
                                  reviews[itemDetails._id]?.feedback ??
                                  existingRating?.feedback ??
                                  ""
                                }
                                onChange={(e) =>
                                  handleCommentChange(
                                    itemDetails._id,
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-lg p-1 sm:p-2 text-[10px] sm:text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                              ></textarea>

                              {/* ✅ Image Upload Section */}
                              <div className="sm:mt-2">
                                <label className="text-[10px] sm:text-sm font-semibold text-gray-700">
                                  Upload Images
                                </label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) =>
                                    handleImageUpload(
                                      itemDetails._id,
                                      e.target.files
                                    )
                                  }
                                  className="mt-1 block w-full text-[10px] sm:text-sm border border-gray-300 rounded-lg p-1 cursor-pointer"
                                />

                                {/* Preview selected images */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {(reviews[itemDetails._id]?.images || []).map(
                                    (img, idx) => (
                                      <div key={idx} className="relative">
                                        <img
                                          src={URL.createObjectURL(img)}
                                          alt="preview"
                                          className="w-12 h-12 sm:w-20 sm:h-20 object-cover rounded-lg border"
                                        />
                                        <button
                                          onClick={() =>
                                            removeSelectedImage(
                                              itemDetails._id,
                                              idx
                                            )
                                          }
                                          className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full text-xs px-1"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              {/* ✅ Submit or Update */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    isAlreadyRated
                                      ? handleReviewUpdate(
                                          itemDetails._id,
                                          existingRating._id
                                        )
                                      : handleReviewSubmit(itemDetails._id)
                                  }
                                  className="mt-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                                >
                                  {isAlreadyRated ? "Update" : "Submit"}
                                </button>

                                {isAlreadyRated && (
                                  <button
                                    onClick={() => setEditingItemId(null)}
                                    className="mt-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Delete Dialog Box */}
      {deleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Delete Review?
            </h3>
            <p className="text-gray-600 text-sm mb-5">
              Are you sure you want to permanently delete your review for this
              product?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleDeleteRating(deleteDialog);
                  setDeleteDialog(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteDialog(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
