import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../ContextApi/CartContext.jsx";
import { X, Minus, Plus, ShoppingBag, ChevronDown, Edit } from "lucide-react";
import { useOrder } from "../../ContextApi/OrderContext.jsx";

const ShoppingCart = ({ isOpen, onClose }) => {
  const {
    cartProducts,
    removeFromCart,
    cartCount,
    updateQuantity,
    shipping,
    subtotal,
  } = useCart();
  const { setOrderItems } = useOrder();
  const [hasVoucher, setHasVoucher] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const navigate = useNavigate();

  // Lock the page scroll while cart is open and avoid overscroll chaining
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overscrollBehavior = "none";
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overscrollBehavior = "";
      if (top) {
        const scrollY = parseInt(top || "0", 10) * -1;
        window.scrollTo(0, scrollY || 0);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overscrollBehavior = "";
    };
  }, [isOpen]);

  const discount = hasVoucher && voucherCode ? subtotal * 0.1 : 0;

  const handleCompleteOrder = () => {
    setOrderItems(cartProducts);
    onClose();
    navigate("/checkout/review");
  };

  return (
    <div
      className={`fixed inset-0 z-10001 overflow-hidden transition-opacity duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{ overscrollBehaviorY: "none" }} // prevent scroll chaining on root
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
          isOpen ? "bg-opacity-50" : "bg-opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ overscrollBehavior: "contain" }} // contain drawer overscroll
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <h3 className="heading-3 text-gray-800">Shopping Cart</h3>
              <div
                data-testid="cart-count"
                className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {cartCount}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div
            className="flex-1 overflow-y-auto p-4"
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }} // smooth iOS scroll + contain
          >
            {cartProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-body mb-2">
                  Your cart is empty
                </p>
                <p className="text-gray-400 text-body">
                  Add some plants to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartProducts.map((product, index) => (
                  <div
                    key={`${
                      product.itemId?._id ?? product._id ?? product.sku ?? index
                    }-${index}`}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg transform transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {
                        <img
                          src={product?.displayImage}
                          alt={product?.itemId?.name}
                          className="w-full h-full object-cover"
                        />
                      }
                    </div>
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {product?.itemId?.name}
                      </h3>
                      <p className="text-xs text-gray-500 ">
                        {product?.color} | {product?.size}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹
                        {product?.itemId?.variants?.[0]?.offerPrice ||
                          product?.itemId?.variants?.[0]?.sellingPrice ||
                          product.offerPrice ||
                          product?.sellingPrice ||
                          0}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              product._id, //CartId
                              Math.max(1, product.quantity - 1)
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-150"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>

                        <span
                          data-testid="quantity"
                          className="w-8 text-center text-sm font-medium"
                        >
                          {product.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(product._id, product.quantity + 1)
                          }
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-150"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      data-testid="remove-from-cart"
                      onClick={() => removeFromCart(product._id)} //CartId
                      className=" transition-colors duration-200"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-green-900" />
                    </button>
                    <Edit
                      onClick={() => {
                        onClose();
                        navigate(
                          `/edit-cart?cartId=${product._id}&productId=${product.itemId._id}`
                        ); // CartId
                      }}
                      className="w-4 h-4 text-gray-400 hover:text-green-900"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Order Summary */}
          {cartProducts.length > 0 && (
            <div className=" border-gray-200 p-4 bg-white">
              {/* Checkout Button */}
              <button
                onClick={handleCompleteOrder}
                className="w-full mt-4 bg-green-700 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-95"
              >
                COMPLETE ORDER
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
