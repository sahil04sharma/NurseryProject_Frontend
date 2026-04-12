import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../../ContextApi/OrderContext";
import backend from "../../network/backend";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import StarRating from "../common/StarRating";

export default function MyRating() {
  const { orders } = useOrder();
  const navigate = useNavigate();

  const [userRatings, setUserRatings] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Dialog states now store IDs instead of boolean
  const [deleteRatingDialogId, setDeleteRatingDialogId] = useState(null);

  //  Extract itemId from any product type
  const extractItemId = useCallback(
    (item) =>
      item?.details?._id ||
      item?.details?.plant?._id ||
      item?.details?.pot?._id,
    []
  );

  // Fetch Ratings
  const fetchUserRatings = useCallback(async () => {
    try {
      const { data } = await backend.get("/rating/get-user");
      setUserRatings(data?.data || []);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  }, []);

  useEffect(() => {
    fetchUserRatings();
  }, [fetchUserRatings]);

  // Apply order filter (only delivered orders)

  const applyFilter = useCallback(() => {
    if (!orders?.length) return setFilteredOrders([]);
    const deliveredOnly = orders.filter(
      (order) =>
        order.shipmentStatus &&
        order.shipmentStatus.toLowerCase() === "delivered"
    );
    setFilteredOrders(deliveredOnly);
  }, [orders]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  // Look up rating for item

  const getRatingForItem = useCallback(
    (itemId) => userRatings.find((r) => r.itemId?._id === itemId),
    [userRatings]
  );

  // Delete rating handler

  const handleDeleteRating = useCallback(async (ratingId) => {
    try {
      await backend.post(`/rating/delete/${ratingId}`);
      setUserRatings((prev) => prev.filter((r) => r._id !== ratingId));
      setDeleteRatingDialogId(null);
      toast.success("Rating deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete rating");
    }
  }, []);

  // Edit rating handler
  const handleEditRating = useCallback(
    (e, orderId) => {
      e.stopPropagation();
      navigate(`${orderId}`);
    },
    [navigate]
  );

  //   Split orders

  const ratedOrders = useMemo(() => {
    return filteredOrders.filter((order) =>
      order.orderItems.some((item) => {
        const id = extractItemId(item);
        return userRatings.some((r) => r.itemId?._id === id);
      })
    );
  }, [filteredOrders, userRatings, extractItemId]);

  const unratedOrders = useMemo(() => {
    return filteredOrders.filter((order) =>
      order.orderItems.some((item) => {
        const id = extractItemId(item);
        return !userRatings.some((r) => r.itemId?._id === id);
      })
    );
  }, [filteredOrders, userRatings, extractItemId]);

  //Render a single order card (memoized logic)

  const renderOrderCard = useCallback(
    (order) => (
      <div
        key={order._id}
        onClick={() => navigate(`${order._id}`)}
        className="relative p-3 lg:p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer mb-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <p className="text-sm lg:text-base font-semibold text-gray-700">
            Order ID: {order._id}
          </p>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            {order.shipmentStatus}
          </span>
        </div>

        <div className="space-y-3">
          {[...order.orderItems]
            .sort((a, b) => {
              const aRating = getRatingForItem(extractItemId(a));
              const bRating = getRatingForItem(extractItemId(b));
              return (bRating ? 1 : 0) - (aRating ? 1 : 0);
            })
            .map((item, index) => {
              const itemId = extractItemId(item);
              const itemRating = getRatingForItem(itemId);

              const itemDetails = {
                name:
                  item?.details?.name ||
                  item?.details?.plant?.name ||
                  item?.details?.pot?.name ||
                  "Unnamed Product",
                displayImage:
                  item?.details?.bannerImg?.[0] ||
                  item?.details?.plant?.bannerImg?.[0] ||
                  item?.details?.pot?.bannerImg?.[0],
                quantity: item.quantity,
                price: item.price,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize,
              };

              return (
                <div
                  key={index}
                  className="border-b pb-3 last:border-none relative"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={itemDetails.displayImage}
                      alt={itemDetails.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm lg:text-base font-medium text-gray-700">
                        {itemDetails.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {itemDetails.quantity} | ₹{itemDetails.price}
                        {itemDetails.selectedSize &&
                          ` | Size: ${itemDetails.selectedSize}`}
                        {itemDetails.selectedColor &&
                          ` | Color: ${itemDetails.selectedColor}`}
                      </p>
                    </div>
                  </div>

                  {itemRating ? (
                    <div className="mt-3 w-full bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-gray-700">
                          Your Review:
                        </h4>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => handleEditRating(e, order._id)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Pencil size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteRatingDialogId(itemRating._id);
                            }}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex mb-1">
                        <StarRating rating={itemRating.rating} />
                      </div>

                      {itemRating.feedback && (
                        <p className="text-xs text-gray-600 italic mb-2">
                          "{itemRating.feedback}"
                        </p>
                      )}

                      {itemRating.ratingImg?.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {itemRating.ratingImg.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="rating-img"
                              className="w-12 h-12 rounded object-cover border"
                            />
                          ))}
                        </div>
                      )}

                      {itemRating.likes?.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          ❤️ {itemRating.likes.length} likes
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${order._id}`);
                      }}
                      className="absolute bottom-3 right-3 px-3 py-1 text-xs bg-[#1a4122] text-white rounded-lg hover:bg-[#3b874a]"
                    >
                      Add Review
                    </button>
                  )}
                </div>
              );
            })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-3 pt-3 border-t">
          <div className="text-sm text-gray-600">
            <p>Placed on: {new Date(order.createdAt).toDateString()}</p>
            <p className="font-semibold text-gray-700">
              Total: ₹{order.totalPrice}
            </p>
          </div>
        </div>
      </div>
    ),
    [navigate, getRatingForItem, extractItemId, handleEditRating]
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl p-4 lg:p-8 mx-4 lg:mx-0 mb-6">
        {ratedOrders.length > 0 && (
          <>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-700 mb-6">
              My Ratings
            </h2>
            {ratedOrders.map((order) => renderOrderCard(order))}
          </>
        )}

        {unratedOrders.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-700 mb-6">
              Add Ratings
            </h2>
            {unratedOrders.map((order) => renderOrderCard(order))}
          </div>
        )}

        {ratedOrders.length === 0 && unratedOrders.length === 0 && (
          <p className="text-gray-500 text-center">No Reviews found.</p>
        )}
      </div>

      {/* Delete Rating Dialog */}
      {deleteRatingDialogId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Delete Rating?
            </h3>

            <p className="text-gray-600 text-sm mb-5">
              Are you sure you want to permanently delete this rating?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDeleteRating(deleteRatingDialogId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>

              <button
                onClick={() => setDeleteRatingDialogId(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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
