import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Heart, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../../ContextApi/WishlistContext.jsx";
import { useCart } from "../../ContextApi/CartContext.jsx";
import heroImg from "../../assets/heroImg/heroplant1.png";

function WishlistButton() {
  const navigate = useNavigate();
  const { wishlistProducts, toggleWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  // ✅ Compute panel position only when opened (no render loop)
  useEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos((prev) => {
      const next = { top: r.bottom + 8, right: window.innerWidth - r.right };
      // avoid unnecessary re-renders
      if (prev.top !== next.top || prev.right !== next.right) return next;
      return prev;
    });
  }, [open]);

  // ✅ Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);


  // ✅ Log only once when wishlist changes (for debugging)
  useEffect(() => {
    if (open) console.log("Wishlist products:", wishlistProducts);
  }, [open, wishlistProducts]);

  // ✅ Memoize list to prevent re-renders unless wishlist changes
  const wishlistItems = useMemo(() => {
    return wishlistProducts.map((p) => {
      const wishlistId = p.id || p._id;
      const productId = p?.items?.productId || p?.product?._id;
      const img = p?.product?.bannerImg?.[0] || heroImg;
      const name = p?.product?.name || "Unknown Plant";
      const price = p?.product?.variants[0]?.offerPrice || p?.product?.variants[0]?.sellingPrice || 0;

      return (
        <li key={wishlistId} className="p-3 flex gap-3 items-center">
          <img
            src={img}
            alt={name}
            className="w-12 h-12 object-cover rounded bg-gray-100"
          />
          <div className="min-w-0 flex-1">
            <Link
              to={`/product/plant/${productId}`}
              className="block text-sm font-medium truncate hover:underline"
              onClick={() => setOpen(false)}
            >
              {name}
            </Link>
            <div className="text-xs text-gray-600">₹{price}</div>

            <div className="mt-1 flex gap-2">
              <button
                className="text-xs text-[#1A4122] hover:underline"
                onClick={() => {
                  addToCart({
                    itemId: productId,
                    size: p.product?.variants[0]?.label,
                    productType: p.items?.productType,
                  });
                  toggleWishlist({ productId, wishlistId });
                }}
              >
                Move to Cart
              </button>
              <button
                className="text-xs text-red-600 hover:underline"
                onClick={() => toggleWishlist({ productId, wishlistId })}
              >
                Remove
              </button>
            </div>
          </div>

          <button
            aria-label="Remove"
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => toggleWishlist({ productId, wishlistId })}
          >
            <X className="w-4 h-4" />
          </button>
        </li>
      );
    });
  }, [wishlistProducts, addToCart]);

  return (
    <>
      {/* Icon button */}
      <button
        ref={btnRef}
        aria-label="Wishlist"
        onClick={() => setOpen((v) => !v)}
        className="relative w-8 h-8"
      >
        <Heart className="text-gray-600" size={20} />
        {wishlistCount > 0 && (
          <p className="absolute top-0 right-0 bg-red-400 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {wishlistCount}
          </p>
        )}
      </button>

      {/* Portal panel */}
      {open &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: "fixed", top: pos.top, right: pos.right }}
            className="w-80 max-h-[70vh] overflow-auto bg-white shadow-lg border rounded z-10000"
          >
            <div className="p-3 border-b flex justify-between">
              <p>Wishlist</p>
              <button className="cursor-pointer text-green-600" onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="p-4 text-sm text-center text-gray-500">
                No items in wishlist
              </div>
            ) : (
              <ul className="divide-y">{wishlistItems}</ul>
            )}

            {wishlistProducts.length > 0 && (
              <div className="p-3 border-t">
                <button
                  className="block w-full text-center text-sm text-white bg-[#1A4122] rounded py-2 hover:bg-[#0f2614]"
                  onClick={() => {
                    setOpen(false);
                    navigate("/wishlist");
                  }}
                >
                  View Wishlist
                </button>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}

export default WishlistButton;
