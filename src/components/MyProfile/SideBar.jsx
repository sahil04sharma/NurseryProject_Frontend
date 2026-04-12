import React, { useState } from "react";
import {
  Menu,
  X,
  User,
  Package,
  MapPin,
  Bell,
  CreditCard,
  ChevronRight,
  Trash,
  KeyRound,
} from "lucide-react";
import { BiSupport } from "react-icons/bi";
import { NavLink } from "react-router-dom";

import { Star } from "lucide-react";

const navigationItems = [
  { id: "profile", icon: User, label: "My Profile", path: "/my-profile" },
  { id: "addresses", icon: MapPin, label: "Addresses", path: "my-addresses" },
  { id: "orders", icon: Package, label: "Orders", path: "my-orders" },
  { id: "support", icon: BiSupport, label: "Support", path: "support" },
  {
    id: "notifications",
    icon: Bell,
    label: "Notifications",
    path: "notifications",
  },
  { id: "ratings", icon: Star, label: "My Ratings", path: "my-ratings" },
  {
    id: "resetPass",
    icon: KeyRound,
    label: "Reset Password",
    path: "resetPass",
  },
  { id: "wallet", icon: CreditCard, label: "Cards & Wallet", path: "wallet" },
];

const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* 🟩 Hamburger (visible only on mobile) */}
      <button
        className="lg:hidden fixed top-26 md:top-32 z-50 p-2  bg-white rounded-full shadow-md hover:bg-gray-100 transition"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open navigation menu"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* 🖤 Overlay (mobile only, appears when sidebar is open) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* 🧭 Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 pt-4 md:pt-8 lg:pt-0 z-50 w-64 bg-white shadow-xl 
          lg:shadow-none lg:translate-x-0 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center px-5 pt-5 pb-2 border-b lg:hidden">
          <h2 className="heading-2 text-gray-800">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="px-4 py-6 h-full overflow-y-auto">
          <div className="flex items-center border-b border-gray-300 pb-1">
            <div className="w-12 h-12 bg-[#1a4122] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-700">
                Settings
              </h2>
              <p className=" text-gray-500">Manage your account</p>
            </div>
          </div>

          <nav className="space-y-2 mt-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === "/my-profile"}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#1a4122] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to={"delete-account"}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-red-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Trash className="w-5 h-5 mr-3" />
              {"Delete Account"}
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
