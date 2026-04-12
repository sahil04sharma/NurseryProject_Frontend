import { useState, memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, X, ChevronRight, ChevronDown } from "lucide-react";
import { slugify } from "../../utils/Slugify";
import NavbarSearchBar from "./NavbarSearchBar";
import useApp from "../../ContextApi/AppContext";
import LogoutButton from "../MyProfile/LogoutButton";

const NavbarMobileSidebar = memo(
  ({ isOpen, onClose, navItems, currentPath }) => {
    const [expandedCategoryId, setExpandedCategoryId] = useState(null);
    const navigate = useNavigate();
    const { categories } = useApp();

    // CATEGORY TOGGLE
    const handleCategoryToggle = useCallback((categoryId) => {
      setExpandedCategoryId((prev) =>
        prev === categoryId ? null : categoryId
      );
    }, []);

    // ACTIVE HELPERS
    const isLinkActive = (item) => {
      if (item.path === "/" && currentPath === "/") return true;
      if (item.path !== "/" && currentPath.startsWith(item.path)) return true;
      return false;
    };

    if (!isOpen) return null;

    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 z-9999 md:hidden"
          onClick={onClose}
        />

        {/* Sidebar */}
        <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-10001 shadow-2xl md:hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="heading-2 text-[#0A6041]">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close menu"
            >
              <X size={24} className="text-gray-700" />
            </button>
          </div>

          <div className="flex flex-col h-[calc(100%-73px)] overflow-y-auto">
            {/* Search */}
            <div className="p-5 border-b border-gray-100">
              <NavbarSearchBar onClose={onClose} />
            </div>

            {/* Navigation */}
            <nav className="flex-1">
              {navItems.map((item) => {
                const isCategory = item.isCategory;
                const isExpanded = expandedCategoryId === item._id;
                const isActive = isLinkActive(item);
                const categorySlug = slugify(item.name);

                const categoryData = categories.find(
                  (cat) => cat?._id === item?._id
                );

                const subcategories = categoryData?.subCategories || [];

                const itemPath = isCategory
                  ? `/ViewAll-Item?category=${categorySlug}`
                  : item.path;

                return (
                  <div key={item._id} className="border-b border-gray-100">
                    {/* Category Row */}
                    <div className="flex items-center">
                      <Link
                        to={itemPath}
                        className={`flex-1 px-6 py-4 transition-colors ${
                          isActive
                            ? "bg-[#0A6041]/10 text-[#0A6041] font-semibold"
                            : "text-black hover:bg-[#0A6041]/5 hover:text-[#0A6041]"
                        }`}
                        onClick={onClose}
                      >
                        <p className="text-body">{item.name}</p>
                      </Link>

                      {isCategory && (
                        <button
                          onClick={() => handleCategoryToggle(item._id)}
                          className="px-4 py-4 text-gray-600 hover:text-[#0A6041]"
                          aria-label="Toggle subcategories"
                        >
                          {isExpanded ? (
                            <ChevronDown size={18} />
                          ) : (
                            <ChevronRight size={18} />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Subcategories */}
                    {isCategory && isExpanded && (
                      <div key={item._id} className="bg-gray-50">
                        {subcategories.length === 0 ? (
                          <p className="px-6 py-3 text-body text-gray-500">
                            No subcategories
                          </p>
                        ) : (
                          <ul className="py-1">
                            {subcategories.map((subcat) => {
                              const subSlug = slugify(subcat.subCategory);

                              return (
                                <li
                                  key={subcat._id}
                                  className="border-t border-gray-100"
                                >
                                  <Link
                                    to={`/ViewAll-Item?category=${categorySlug}&sub=${subSlug}`}
                                    className="block px-10 py-3 text-sm text-gray-700 hover:bg-white hover:text-[#0A6041]"
                                    onClick={onClose}
                                  >
                                    {subcat.subCategory}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="border-t border-gray-200">
              <button
                className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-[#0A6041]/5 hover:text-[#0A6041]"
                onClick={() => {
                  navigate("/my-profile");
                  onClose();
                }}
              >
                <User size={22} />
                <p className="text-body">My Account</p>
              </button>

              <div className="flex items-start gap-3 w-full px-2 pb-3 text-gray-700 hover:bg-[#0A6041]/5 hover:text-[#0A6041]">
                <div className="relative">
                  <LogoutButton className="text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

NavbarMobileSidebar.displayName = "NavbarMobileSidebar";
export default NavbarMobileSidebar;
