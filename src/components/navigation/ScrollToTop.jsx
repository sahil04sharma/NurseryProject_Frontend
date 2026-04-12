// src/components/navigation/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ behavior = "auto" }) {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If a hash is present, let the browser handle anchor jump after paint
    if (hash) {
      // small timeout to ensure target exists
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: behavior === "smooth" ? "smooth" : "auto" });
        else window.scrollTo({ top: 0, left: 0, behavior });
      }, 0);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior });
    }
  }, [pathname, search, hash, behavior]);

  return null;
}
