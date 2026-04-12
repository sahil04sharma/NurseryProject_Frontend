// src/components/products/AddToCartButton.jsx
import CartButton from "../CartButton.jsx";

export default function AddToCartButton({
  wished,
  product,
  quantity = 1,
  className = "",
  children = "Add To Cart",
}) {
  return (
    <CartButton
      wished={wished}
      product={product}
      quantity={quantity}
      className={
        className ||
        "flex items-center justify-center flex-1 border-2 border-green-900 bg-[#1A4122] text-sm md:text-base transition-colors text-white cursor-pointer w-full h-full px-2 py-1 md:py-2 rounded-lg font-medium text-center"
      }
    >
      {children}
    </CartButton>
  );
}
