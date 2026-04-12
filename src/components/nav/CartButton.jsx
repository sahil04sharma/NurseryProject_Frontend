// components/nav/CartButton.jsx
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../ContextApi/CartContext";

export default function CartButton({ onToggle }) {
  const { cartCount } = useCart();

  return (
    <button className="relative p-1.5" onClick={onToggle} aria-label="Cart">
      <ShoppingCart size={20} className="text-gray-600" />
      {cartCount > 0 && (
        <p className="absolute top-0 right-0 bg-green-700 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {cartCount}
        </p>
      )}
    </button>
  );
}
