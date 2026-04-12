import React from "react";
import { useCart } from "../ContextApi/CartContext.jsx";
import "react-toastify/dist/ReactToastify.css";
import { useWishlist } from "../ContextApi/WishlistContext.jsx";

const CartButton = ({ wished, product, quantity = 1, children, className }) => {
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();
  const wishlistId = wished?._id;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    if (wishlistId) removeFromWishlist(wishlistId);
  };

  return (
    <div onClick={handleAddToCart} className={className} role="button">
      {children}
    </div>
  );
};

export default CartButton;
