import { createContext, useContext, useState, useEffect, useMemo } from "react";
import backend from "../network/backend";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading, setLoading } = useAuth();
  const [cartProducts, setCartProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("user-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const loadCart = async () => {
    if (!user) {
      return;
    }
    if (cartProducts) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await backend.get("/cart/user");
      setCartProducts(data?.cartItems || []);
      localStorage.setItem("user-cart", JSON.stringify(data?.cartItems));
    } catch (err) {
      console.error("[cart] load failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Load cart from backend when app starts (if logged in)
  useEffect(() => {
    loadCart();
  }, []);

  // Add product to cart
  const addToCart = async (product) => {
    try {
      await backend.post("/cart/add", product);
      const { data } = await backend.get("/cart/user");
      localStorage.removeItem("user-cart");
      setCartProducts(data?.cartItems || []);
      toast.success("Product added to cart successfully.");
    } catch (err) {
      console.error("[cart] add failed", err);
    }
  };

  // Update quantity
  const updateQuantity = async (cartId, newQuantity) => {
    try {
      await backend.put(`/cart/update/${cartId}`, { quantity: newQuantity });
      const { data } = await backend.get("/cart/user");
      localStorage.removeItem("user-cart");
      setCartProducts(data?.cartItems || []);
    } catch (err) {
      console.error("[cart] update failed", err);
      toast.error("Failed to update cart on server");
    }
  };

  const updateCartProduct = async (cartId, updatedFields) => {
    try {
      await backend.put(`/cart/update/${cartId}`, updatedFields);
      const { data } = await backend.get("/cart/user");
      localStorage.removeItem("user-cart");
      setCartProducts(data?.cartItems || []);
      toast.success("Cart item updated");
    } catch (err) {
      console.error("[cart] updateCartProduct failed", err);
      toast.error("Failed to update cart item");
    }
  };

  // Remove product
  const removeFromCart = async (cartId) => {
    setCartProducts((prev) => prev.filter((p) => p._id !== cartId));

    try {
      await backend.delete(`/cart/delete/${cartId}`);
      localStorage.removeItem("user-cart");
    } catch (err) {
      console.error("[cart] remove failed", err);
      toast.error("Failed to remove from cart");
    }
  };

  const clearCart = async () => {
    setCartProducts([]);
  };

  // Computed values
  const { subtotal, totalDiscount, totalPrice, cartCount, shipping, tax } =
    useMemo(() => {
      const items = Array.isArray(cartProducts) ? cartProducts : [];

      const subtotal = items.reduce((sum, p) => {
        const variants = Array.isArray(p?.itemId?.variants)
          ? p.itemId.variants
          : [];
        const v0 = variants?.[0]; // safe array indexing with ?.[] support
        const price =
          v0?.offerPrice ?? v0?.sellingPrice ?? p?.sellingPrice ?? 0;
        const qty = p?.quantity ?? 1;
        return sum + price * qty;
      }, 0);

      const shipping = subtotal > 1500 ? 0 : 99;
      const tax = Math.round(subtotal * 0.05);
      const totalPrice = subtotal + shipping + tax;
      const cartCount = items.reduce((sum, p) => sum + (p?.quantity ?? 1), 0);

      return { subtotal, totalPrice, cartCount, tax, shipping };
    }, [cartProducts]);

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        loading,
        addToCart,
        updateQuantity,
        updateCartProduct,
        removeFromCart,
        clearCart,
        subtotal,
        totalDiscount,
        totalPrice,
        cartCount,
        shipping,
        tax,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
