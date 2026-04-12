import { useEffect, useState } from "react";
import ProductCard from "../../components/products/ProductCard.jsx";
import ProductSkeleton from "../../components/products/ProductSkeleton.jsx";
import { useWishlist } from "../../ContextApi/WishlistContext.jsx";
import { useAuth } from "../../ContextApi/AuthContext.jsx";

// FIXED FUNCTION
const getProductDisplay = (wishlistItem) => {
  const product = wishlistItem?.product;

  if (!product)
    return { price: 0, originalPrice: 0, image: "", description: "—" };

  const image = product.bannerImg?.[0] ?? "";

  const price =
    product.sellingPrice ?? product.variants?.[0]?.sellingPrice ?? price;

  const originalPrice =
    product.offerPrice ?? product.variants?.[0]?.offerPrice ?? 0;

  const description =
    Array.isArray(product.description) && product.description.length > 0
      ? product.description[0]
      : product.shortDescription ?? product.summary ?? "—";

  return { price, originalPrice, image, description };
};

// Stars
const renderStars = (rating = 4.5) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full || (i === full && half) ? "★" : "☆"}</span>
      ))}
    </>
  );
};

export default function WishlistPage() {
  const { wishlistProducts } = useWishlist();
  const { loading, setLoading } = useAuth();
  console.log(wishlistProducts);
  useEffect(() => {
    const id = requestAnimationFrame(() => setLoading(false));
    return () => cancelAnimationFrame(id);
  }, []);

  const hasItems = wishlistProducts?.length > 0;

  return (
    <main className="w-full min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-8">
      {loading && (
        <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 w-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i}>
              <ProductSkeleton />
            </li>
          ))}
        </ul>
      )}

      {!loading && !hasItems && (
        <p className="text-gray-600 text-body">No items in wishlist</p>
      )}

      {!loading && hasItems && (
        <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 w-full">
          {wishlistProducts.map((p) => (
            <li key={p._id} className="w-full">
              <div className="w-full [&>div]:w-full! [&>div]:shrink-0!">
                <ProductCard
                  Id={p.items.productId}
                  product={p}
                  getProductDisplay={getProductDisplay}
                  renderStars={renderStars}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
