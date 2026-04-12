import React from "react";
import {
  X,
  CheckCircle,
  Truck,
  Package,
  Home,
  RotateCcw,
  XCircle,
} from "lucide-react";

const TrackOrderModal = ({ order, onClose }) => {
  if (!order) return null;
  console.log(order);

  // Handle cancelled or returned separately from shipment flow
  const isCancelled = order.shipmentStatus?.toLowerCase() === "cancelled";
  const isReturned = order.shipmentStatus?.toLowerCase() === "returned";

  // Step tracker
  const steps = [
    { label: "processing", icon: Package },
    { label: "shipped", icon: CheckCircle },
    { label: "out for delivery", icon: Truck },
    { label: "delivered", icon: Home },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.label.toLowerCase() === order?.shipmentStatus?.toLowerCase()
  );

  const firstItem = order?.orderItems?.[0];
  const pot = firstItem?.details?.pot;
  const plant = firstItem?.details?.plant;

  const productImage =
    firstItem?.details?.bannerImg?.[0] ||
    pot?.bannerImg?.[0] ||
    plant?.bannerImg?.[0] ||
    "/placeholder.jpg";
  const productName =
    firstItem?.details?.name || pot?.name || plant?.name || "Unnamed";
  const quantity = firstItem?.quantity || 1;
  const price = firstItem?.price || 0;
  const color = firstItem?.selectedColor || "-";
  const size = firstItem?.selectedSize || "-";

  // Colors for different order outcomes
  const statusColor = isCancelled
    ? "text-red-600"
    : isReturned
    ? "text-orange-600"
    : "text-green-700";

  const statusBgColor = isCancelled
    ? "bg-red-50/70 border-red-200"
    : isReturned
    ? "bg-orange-50/70 border-orange-200"
    : "bg-green-50/70 border-green-100";

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center px-6 pt-26 z-50">
      <div className="bg-white w-full md:max-w-2xl rounded-2xl shadow-xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 sm:p-2 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>

        {/* Header */}
        <h3 className="text-xs sm:text-sm md:text-xl font-bold text-gray-800 mb-2">
          Track Order
        </h3>

        <div className="text-gray-600 mb-3 text-xs sm:text-sm">
          <p>
            Order ID:
            <span className="font-medium text-gray-800"> {order._id}</span>
          </p>
          <p>
            Placed on:{" "}
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Product */}
        <div
          className={`flex gap-2 items-center border ${statusBgColor} rounded-xl p-2 sm:p-4  mb-4`}
        >
          <img
            src={productImage}
            alt={productName}
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl object-cover shadow-md"
          />
          <div className="ml-4 text-xs sm:text-lg">
            <p className={`font-semibold ${statusColor}`}>{productName}</p>
            <p className="text-gray-600">
              {color} • {size}
            </p>
            <p className="mt-1 font-medium text-green-700">₹ {price}</p>
            <p className="text-gray-500">Qty: {quantity}</p>
          </div>
        </div>

        {/* Step Tracker */}
        {!isCancelled && !isReturned && (
          <div className="relative flex justify-between items-center mb-6">
            {/* Grey line */}
            <div className="absolute top-4 sm:top-5 left-4 sm:left-8 w-[90%] h-1 bg-gray-200 rounded-full" />

            {/* Green progress line */}
            <div
              className="absolute top-4 sm:top-5 left-4 sm:left-8 h-1 bg-green-500 rounded-full transition-all duration-700 ease-in-out"
              style={{
                width: `${Math.max(
                  0,
                  (currentStepIndex / (steps.length - 1)) * 90
                )}%`,
              }}
            />

            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-4 ${
                      isCompleted
                        ? "border-green-500 bg-green-100 text-green-700"
                        : "border-gray-200 bg-gray-100 text-gray-400"
                    } transition duration-500`}
                  >
                    <Icon size={18} />
                  </div>
                  <p
                    className={`mt-2 text-[8px] sm:text-xs font-medium ${
                      isCompleted ? "text-green-700" : "text-gray-400"
                    }`}
                  >
                    {step.label.charAt(0).toUpperCase() + step.label.slice(1)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* If order is Cancelled or Returned */}
        {(isCancelled || isReturned) && (
          <div className="flex flex-col items-center justify-center py-2 sm:py-6 mb-4">
            {isCancelled ? (
              <>
                {" "}
                <XCircle className="sm:w-12 sm:h-12 text-red-500 mb-2" />
                <p className="text-xs sm:text-lg font-semibold text-red-600">
                  This order has been cancelled.
                </p>
              </>
            ) : (
              <>
                <RotateCcw className="w-12 h-12 text-orange-500 mb-2" />
                <p className="text-xs sm:text-lg font-semibold text-orange-600">
                  This order has been returned.
                </p>
              </>
            )}
          </div>
        )}

        {/* Status & Delivery Info */}
        <div className="text-xs sm:text-sm text-gray-600">
          <p>
            <span className="font-medium">Current Status:</span>{" "}
            <span className={`font-semibold ${statusColor}`}>
              {order.shipmentStatus}
            </span>
          </p>
          {!isCancelled && !isReturned && (
            <p>
              <span className="font-medium">Expected Delivery:</span>{" "}
              {new Date(
                new Date(order.createdAt).setDate(
                  new Date(order.createdAt).getDate() + 3
                )
              ).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderModal;
