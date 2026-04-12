import { createContext, useContext, useState, useEffect } from "react";
import backend from "../network/backend";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import { useMemo } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const loadWishlist = async () => {
    try {
      const { data } = await backend.get("/user/wishlist/user");
      setWishlistProducts(data?.wishlist || []);
      localStorage.setItem("wishlist", JSON.stringify(data?.wishlist));
    } catch (e) {
      console.error("[wishlist] failed to load from server:", e);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (wishlistProducts.length > 0) return;
    loadWishlist();
  }, []);

  //  Add Wishlist Item
  const addToWishlist = async (productId) => {
    try {
      const { data } = await backend.post("/user/wishlist/add", { productId });

      if (data.success) {
        loadWishlist();
        // toast.success("Added to wishlist");
      }
    } catch (e) {
      console.error("[wishlist] add failed:", e);
      toast.error("Failed to add wishlist item.");
    }
  };

  //  Remove Wishlist Item
  const removeFromWishlist = async (wishlistId) => {
    try {
      const { data } = await backend.delete(
        `/user/wishlist/delete/${wishlistId}`
      );

      if (data.success) {
        loadWishlist();
        // toast.success("Removed from wishlist");
      }
    } catch (e) {
      console.error("[wishlist] remove failed:", e);
      toast.error("Failed to remove wishlist item.");
    }
  };

  // ✅ Toggle wishlist (add/remove)
  const toggleWishlist = async ({ productId, wishlistId }) => {
    const exists = isWishlisted(productId);
    if (exists) {
      await removeFromWishlist(wishlistId);
    } else {
      await addToWishlist(productId);
    }
  };
  
  const wishedItems = useMemo(() => {
    return wishlistProducts.map((w) => {
      return {
        productId: w?.items?.productId ?? w?.product?._id,
        wishlistId: w?._id,
      };
    });
  }, [wishlistProducts]);
  
  const isWishlisted = (id) => {
    return wishlistProducts.some(
      (p) => (p?.items?.productId ?? p?.product?._id ?? p._id) === id
    );
  };

  const wishlistCount = wishlistProducts.length;

  return (
    <WishlistContext.Provider
      value={{
        wishedItems,
        wishlistProducts,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        wishlistCount,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
