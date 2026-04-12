import { useEffect, useRef } from "react";

/**
 * useScrollForwarder
 * - scrollRef: ref to the inner scrollable element
 * - enable: boolean to enable behaviour
 */
function useScrollForwarder(scrollRef, enable = true) {
  const touchStartY = useRef(0);

  useEffect(() => {
    if (!enable) return;

    const el = scrollRef.current;
    if (!el) return;

    // WHEEL (desktop)
    const onWheel = (e) => {
      // only vertical scroll
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      const atTop = el.scrollTop === 0;
      const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;

      // Scrolling down (positive deltaY) and at bottom -> forward to window
      if (e.deltaY > 0 && atBottom) {
        // prevent inner elastic behavior
        e.preventDefault();
        // forward to window
        window.scrollBy({ top: e.deltaY, left: 0, behavior: "auto" });
      }

      // Scrolling up (negative deltaY) and at top -> forward to window
      if (e.deltaY < 0 && atTop) {
        e.preventDefault();
        window.scrollBy({ top: e.deltaY, left: 0, behavior: "auto" });
      }
      // else: let the inner element handle it
    };

    // TOUCH (mobile)
    const onTouchStart = (e) => {
      touchStartY.current = e.touches?.[0]?.clientY ?? 0;
    };

    const onTouchMove = (e) => {
      const touchY = e.touches?.[0]?.clientY ?? 0;
      const delta = touchStartY.current - touchY; // positive = scroll down
      const atTop = el.scrollTop === 0;
      const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;

      if (delta > 0 && atBottom) {
        // scrolling down at bottom -> forward
        e.preventDefault();
        window.scrollBy({ top: delta, left: 0, behavior: "auto" });
        // update touchStartY so repeated moves are forwarded correctly
        touchStartY.current = touchY;
      } else if (delta < 0 && atTop) {
        // scrolling up at top -> forward
        e.preventDefault();
        window.scrollBy({ top: delta, left: 0, behavior: "auto" });
        touchStartY.current = touchY;
      } else {
        // let inner element scroll: update start so delta is relative
        touchStartY.current = touchY;
      }
    };

    // addEventListener with passive: false to be able to preventDefault
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [scrollRef, enable]);
}
