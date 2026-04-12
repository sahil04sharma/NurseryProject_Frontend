import React from "react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({
  order,
  setInvoiceOrder,
  setCancelDialog,
  setSelectedOrder,
}) => {
  const navigate = useNavigate();

  // Extracting order items details
  const orderDetails = order.orderItems.map((item) => ({
    name: item?.details?.name,
    displayImage:
      item?.details?.bannerImg?.[0] ||
      item?.details?.plant?.bannerImg?.[0] ||
      item?.details?.pot?.bannerImg?.[0],
    quantity: item.quantity,
    price: item.price,
    selectedColor: item.selectedColor,
    selectedSize: item.selectedSize,
  }));
  return (
    <div
      onClick={() => navigate(`${order._id}`)}
      className="relative p-2 lg:p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <p className="text-xs lg:text-base md:font-semibold text-gray-700">
          Order ID: <span>{order._id}</span>
        </p>
        <span
          className={`px-2 py-1 rounded-full text-xs text-center font-medium ${
            order.shipmentStatus.toLowerCase() === "delivered"
              ? "bg-green-100 text-green-700"
              : order.shipmentStatus.toLowerCase() === "shipped"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.shipmentStatus}
        </span>
      </div>

      <div className="space-y-2">
        {orderDetails.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-b pb-2 last:border-none"
          >
            <img
              src={item.displayImage}
              alt={orderDetails.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-sm lg:text-base font-medium text-gray-700">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">
                Qty: {item.quantity} | ₹{item.price} | Size: {item.selectedSize}{" "}
                | Color: {item.selectedColor}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between md:mt-3 gap-3">
        <div className="text-sm text-gray-600">
          <p className="text-xs md:text-lg">
            Placed on: {new Date(order.createdAt).toDateString()}
          </p>
          <p className="font-semibold text-xs md:text-sm text-gray-700">
            Total: ₹{order.totalPrice}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrder(order);
            }}
            className="px-1 md:px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200"
          >
            Track Order
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setInvoiceOrder(order._id);
            }}
            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200"
          >
            Invoice
          </button>
          {order.shipmentStatus.toLowerCase() !== "delivered" &&
            order.shipmentStatus.toLowerCase() !== "returned" &&
            order.shipmentStatus.toLowerCase() !== "cancelled" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCancelDialog(order._id);
                }}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200"
              >
                Cancel
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(OrderCard);
