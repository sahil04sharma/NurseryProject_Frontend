import React from "react";
import { Link, useLocation } from "react-router-dom";
import { slugify } from "../../utils/Slugify";

export default function NavbarLinks({
  navItems,
  loadingCategories,
  onCategoryEnter,
  onCategoryLeave,
  hoveredCategoryId,
  navigate,
}) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
const activeCategory = searchParams.get("category");


  const isLinkActive = (item) => {
  const currentPath = location.pathname;

  // Normal static links
  if (item.path === "/" && currentPath === "/") return true;
  if (item.path !== "/" && currentPath.startsWith(item.path) && !item.isCategory)
    return true;

  // ✅ CATEGORY ACTIVE CHECK (query-based)
  if (item.isCategory && currentPath === "/ViewAll-Item") {
    const categorySlug = slugify(item.name);
    return activeCategory === categorySlug;
  }

  return false;
};


  return (
    <div className="bg-white px-4 sm:px-6 py-2">
      {loadingCategories ? (
        <div className="text-center text-sm text-gray-400 py-2">
          Loading categories...
        </div>
      ) : (
        <nav className="hidden md:flex justify-center items-center space-x-6">
          {navItems.map((item) => {
            const isCategory = item.isCategory;
            const isHovered = hoveredCategoryId === item._id;
            const isActive = isLinkActive(item);

            return (
              <div
                key={item._id}
                className="relative"
                onMouseEnter={() => isCategory && onCategoryEnter(item._id)}
                onMouseLeave={() => isCategory && onCategoryLeave()}
              >
                <Link
                  to={item.path}
                  className={`
                    text-body block px-2 py-1 font-medium uppercase text-xs transition-all duration-300
                    border-b-2 
                    ${
                      isActive
                        ? "text-[#1a4122] border-[#1a4122]"
                        : isHovered
                        ? "text-[#1a4122] border-[#1a4122]"
                        : "text-gray-700 border-transparent hover:text-[#1a4122] hover:border-[#1a4122]"
                    }
                  `}
                  onClick={(e) => {
                    if (isCategory) {
                      e.preventDefault();
                      const catSlug = slugify(item.name);
                      navigate({
                        pathname: "/ViewAll-Item",
                        search: `?category=${encodeURIComponent(catSlug)}`,
                      });
                    }
                  }}
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
          <button
            className="text-body block px-2 py-1 font-medium uppercase text-xs transition-all duration-300
                    cursor-pointer"
            onClick={() =>
              window.open(
                "https://play.google.com/store/apps/details?id=com.plantV.package",
                "_blank"
              )
            }
          >
            Download App
          </button>
        </nav>
      )}
    </div>
  );
}
