import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../ContextApi/CartContext";
import { slugify } from "../../utils/Slugify";

import AddToCart from "../homepage/ShoppingCart";
import NavbarMobileSidebar from "../nav/NavbarMobileSidebar";

import NavbarTopBar from "./NavbarTopBar";
import NavbarMainBar from "./NavbarMainBar";
import NavbarLinks from "./NavbarLinks";
import NavbarDropdown from "./NavbarDropdown";
import useApp from "../../ContextApi/AppContext";

export default function Navbar({ onSearch }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hideOnScroll, setHideOnScroll] = useState(false);

  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const [suppressHover, setSuppressHover] = useState(false);

  const hoverTimerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { categories, getSubcategories, getSubcategoryImages } = useApp();

  /* ---------------- NAV ITEMS ---------------- */

  const navItems = useMemo(() => {
    const staticItems = [
      { name: "Home", path: "/", _id: "home" },
      { name: "About", path: "/about-us", _id: "about" },
      { name: "Contact", path: "/Contact-us", _id: "contact" },
    ];

    const categoryItems = categories.map((cat) => ({
      name: cat.category,
      path: `/category/${slugify(cat.category)}`,
      _id: cat._id,
      isCategory: true,
    }));

    return [staticItems[0], ...categoryItems, ...staticItems.slice(1)];
  }, [categories]);

  /* ---------------- HOVER HANDLERS ---------------- */

  const handleCategoryMouseEnter = useCallback(
    (categoryId) => {
      if (suppressHover) return;

      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }

      setHoveredCategoryId(categoryId);
    },
    [suppressHover]
  );

  const handleCategoryMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

    hoverTimerRef.current = setTimeout(() => {
      setHoveredCategoryId(null);
      setHoveredSubcategory(null);
    }, 150);
  }, []);

  const handleSubcategoryHover = useCallback((subcat) => {
    setHoveredSubcategory(subcat);
  }, []);

  /* ---------------- DERIVED DATA ---------------- */

  const currentSubcategories = useMemo(() => {
    return hoveredCategoryId ? getSubcategories(hoveredCategoryId) : [];
  }, [hoveredCategoryId, getSubcategories]);

  const currentSubcategoryImages = useMemo(() => {
    return hoveredCategoryId ? getSubcategoryImages(hoveredCategoryId) : [];
  }, [hoveredCategoryId, getSubcategoryImages]);

  const currentCategorySlug = useMemo(() => {
    if (!hoveredCategoryId) return "";
    const cat = navItems.find((n) => n._id === hoveredCategoryId);
    return slugify(cat?.name || "");
  }, [hoveredCategoryId, navItems]);

  /*  Reset subcategory when category changes */
  useEffect(() => {
    if (currentSubcategories.length > 0) {
      setHoveredSubcategory(currentSubcategories[0]);
    } else {
      setHoveredSubcategory(null);
    }
  }, [currentSubcategories]);

  /*  Image resolved by subcategory */
  const currentDisplayImage = useMemo(() => {
    if (!hoveredSubcategory) return null;

    return (
      currentSubcategoryImages.find(
        (img) => img.subCategory === hoveredSubcategory.subCategory
      ) || currentSubcategoryImages[0]
    );
  }, [hoveredSubcategory, currentSubcategoryImages]);

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen || isCartOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isMobileMenuOpen, isCartOpen]);

  useEffect(() => {
    setHoveredCategoryId(null);
    setSuppressHover(true);
  }, [location.search]);

  return (
    <>
      <header
        onMouseMove={() => suppressHover && setSuppressHover(false)}
        className={`fixed top-0 left-0 w-full z-1000 bg-white shadow-sm transition-transform ${
          hideOnScroll ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <NavbarTopBar />
        <NavbarMainBar
          onSearch={onSearch}
          cartCount={cartCount}
          onCartToggle={() => setIsCartOpen((p) => !p)}
          onMobileToggle={() => setIsMobileMenuOpen((p) => !p)}
        />

        <NavbarLinks
          navItems={navItems}
          hoveredCategoryId={hoveredCategoryId}
          onCategoryEnter={handleCategoryMouseEnter}
          onCategoryLeave={handleCategoryMouseLeave}
          navigate={navigate}
        />

        {hoveredCategoryId && (
          <NavbarDropdown
            key={hoveredCategoryId}
            hoveredCategoryId={hoveredCategoryId}
            currentSubcategories={currentSubcategories}
            hoveredSubcategory={hoveredSubcategory}
            handleSubcategoryHover={handleSubcategoryHover}
            currentDisplayImage={currentDisplayImage}
            currentCategorySlug={currentCategorySlug}
            onMouseEnter={() => clearTimeout(hoverTimerRef.current)}
            onMouseLeave={handleCategoryMouseLeave}
            setHoveredCategoryId={setHoveredCategoryId}
          />
        )}
      </header>

      <AddToCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <NavbarMobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        onCartOpen={() => setIsCartOpen(true)}
        currentPath={location.pathname}

      />
    </>
  );
}
