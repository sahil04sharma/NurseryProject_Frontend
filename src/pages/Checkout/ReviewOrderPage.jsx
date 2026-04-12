import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, Leaf, X } from "lucide-react";
import { useCart } from "../../ContextApi/CartContext";
import { useEffect } from "react";
import { useOrder } from "../../ContextApi/OrderContext";
import { toast } from "react-toastify";

export default function ReviewOrderPage() {
  const navigate = useNavigate();
  const { setOrderItems, orderData } = useOrder();
  const { cartProducts } = useCart();

  const handleSelectAddress = () => {
    if (orderData.items.length === 0) {
      toast.error("Add atleast one item to order");
      return;
    }
    navigate("/checkout/address");
  };

  // Remove Items from order
  const removeItem = (cartId) => {
    const filteredItems = orderData.items.filter((item) => item._id !== cartId);
    setOrderItems(filteredItems);
  };

  useEffect(() => {
    // If order is empty but cart has products, hydrate order from cart
    if (
      (!orderData?.items || orderData.items.length === 0) &&
      cartProducts?.length > 0
    ) {
      setOrderItems(cartProducts);
    }
  }, [cartProducts, orderData.items, setOrderItems]);

  return (
    <div className="min-h-screen pt-24 sm:pt-8 md:pt-6 lg:pt-0 bg-green-50 px-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6 text-center">
        <div className="text-md sm:text-xl md:text-2xl font-bold text-green-800 mt-4 flex items-center justify-center gap-2">
          <Leaf className="text-green-600 w-5 h-5 sm:w-7 sm:h-7" />
          Review Your Order
        </div>
        <p className="text-gray-600 text-xs md:mt-2">
          Please review your items before proceeding to delivery details
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product List */}
        <div className="lg:col-span-2 space-y-4">
          {orderData?.items.map((item,index) => {
            const itemDetail = {
              image:
                item?.displayImage ||
                item?.bannerImg?.[0]?.img ||
                item?.itemId?.bannerImg[0],
              name: item?.name || item?.itemId?.name,
              quantity: item?.quantity,
              offerPrice:
                item?.offerPrice || item?.itemId?.variants?.[0]?.offerPrice,
              sellingPrice:
                item?.itemId?.variants?.[0]?.sellingPrice || item?.sellingPrice,
              color: item?.color,
              size: item?.size,
            };
            return (
              <div
                key={index}
                className="bg-white shadow-md rounded-2xl px-2 py-1 md:p-4 flex items-center sm:items-start gap-4 hover:shadow-lg transition"
              >
                <img
                  src={itemDetail?.image}
                  alt={itemDetail?.name}
                  className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-xs md:text-lg font-semibold text-green-800">
                      {itemDetail?.name}
                    </h3>
                    <button onClick={() => removeItem(item._id)}>
                      <X />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 md:gap-3">
                    {itemDetail?.quantity && (
                      <p className="text-xs md:text-sm text-gray-500">
                        Quantity: {itemDetail?.quantity}
                      </p>
                    )}
                    {itemDetail?.color && (
                      <p className="text-xs md:text-sm text-gray-500">
                        Color: {itemDetail?.color}
                      </p>
                    )}
                    {itemDetail?.size && (
                      <p className="text-xs md:text-sm text-gray-500">
                        Size: {itemDetail?.size}
                      </p>
                    )}
                  </div>
                  <div className="md:mt-2 flex items-center gap-3">
                    {itemDetail?.offerPrice && (
                      <span className="text-green-700 font-bold text-xs md:text-lg">
                        ₹{itemDetail?.offerPrice}
                      </span>
                    )}
                    {itemDetail?.sellingPrice && (
                      <span className="text-gray-400 line-through text-xs md:text-sm">
                        ₹{itemDetail?.sellingPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Price Summary */}
        <div className="bg-white shadow-md rounded-2xl p-2 md:p-6 h-full">
          <h3 className="text-md md:text-xl font-semibold text-green-800 mb-2 md:mb-4">
            Price Summary
          </h3>
          <div className="md:space-y-3 text-xs md:text-lg text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{orderData.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {orderData.shipping === 0 ? "Free" : `₹${orderData.shipping}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Platform fee</span>
              <span>0</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>₹{orderData.tax}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-green-800">
              <span>Total</span>
              <span>₹{orderData.total}</span>
            </div>
          </div>

          <button
            onClick={handleSelectAddress}
            className=" mt-2 md:mt-6 w-full text-xs md:text-lg bg-green-600 hover:bg-green-700 text-white font-semibold py-2 md:py-3 rounded-xl flex items-center justify-center gap-2 transition"
          >
            Continue to Address
            <Check size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
