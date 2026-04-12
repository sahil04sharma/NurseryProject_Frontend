import React from "react";
import { ShoppingCart, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavbarSearchBar from "../nav/NavbarSearchBar";
import AccountButton from "../nav/AccountButton";
import WishlistButton from "../nav/WishlistNavButton";
import CartButton from "../nav/CartButton";
import NotificationMenu from "../Notification/NotificationMenu";

export default function NavbarMainBar({
  cartCount,
  onCartToggle,
  onMobileToggle,
  onSearch,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white px-4 sm:px-6 py-2 flex items-center justify-between">
      <div
        onClick={() => navigate("/")}
        className="font-bold text-xl text-[#0A6041] cursor-pointer"
      >
        GreenNest
      </div>

      <NavbarSearchBar onSearch={onSearch} className="hidden md:block flex-1 max-w-2xl mx-8" />

      <div className="hidden md:flex items-center space-x-3 relative z-9999">
        <NotificationMenu />
        <AccountButton />
        <WishlistButton />
        <CartButton onToggle={onCartToggle} />
      </div>

      <div className="md:hidden flex items-center gap-2">
        <button className="relative" onClick={onCartToggle}>
          <ShoppingCart size={20} className="text-gray-600" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-green-700 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </button>
        <button
          onClick={onMobileToggle}
          className="p-1.5 text-gray-700"
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
      </div>
    </div>
  );
}
