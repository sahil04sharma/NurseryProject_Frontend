import React from "react";
import { useOrder } from "../../ContextApi/OrderContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../ContextApi/CartContext";

const BuyNowButton = ({ product }) => {
  const { cartProducts } = useCart();
  const { setOrderItems } = useOrder();
  const navigate = useNavigate();

  const handleBuyProduct = () => {
    setOrderItems([product, ...cartProducts]);
    navigate("/checkout/review");
  };

  return (
    <button
      onClick={handleBuyProduct}
      className="flex-1 bg-white border-2 border-[#1a4122] text-gray-900 w-full h-full px-2 py-1 md:py-2 rounded-lg font-medium hover:bg-[#1a4122] hover:text-white transition-colors text-center cursor-pointer"
    >
      Buy Now
    </button>
  );
};

export default BuyNowButton;
