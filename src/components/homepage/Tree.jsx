import React, {
  useRef,
  useEffect,
  useMemo,
  memo,
  useCallback,
  useState,
} from "react";
import plant3 from "../../assets/heroImg/Plant3.png";
import backend from "../../network/backend";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getWithExpiry, setWithExpiry } from "../../utils/storageWithExpiry";

const Tree = memo(function Tree() {
  const navigate = useNavigate();
  const stageRef = useRef(null);
  const rightSectionRef = useRef(null);
  const knobRef = useRef(null);
  const imgRef = useRef(null);
  const svgRef = useRef(null);
  const ellipseRef = useRef(null);

  const rafRef = useRef(0);
  const intervalRef = useRef(null);
  const idleTimerRef = useRef(null);
  const resizeObsRef = useRef(null);

  const angleRef = useRef(0);
  const lastSectorRef = useRef(0);
  const dirtyRef = useRef(true);
  const draggingRef = useRef(false);
  const manualModeRef = useRef(false);

  const rxRef = useRef(150);
  const ryRef = useRef(30);
  const [banners, setBanners] = useState([]);
  const [ellipseGeom, setEllipseGeom] = useState({
    rx: 150,
    ry: 30,
  });

  const [imgHeight, setImgHeight] = useState(0);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 800);

  const lastFetchTime = useRef(0);

  const fetchBanners = useCallback(async () => {
    const savedHeroBanner = getWithExpiry("hero-banner");
    if (savedHeroBanner) {
      setBanners(savedHeroBanner);
      return;
    }
    const now = Date.now();
    if (now - lastFetchTime.current < 2000) return;
    lastFetchTime.current = now;

    try {
      const { data } = await backend.cachedGet("/frontend/get-all", {
        staleTime: 3 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
      });
      setBanners(data?.data?.[0]?.heroImg);
      setWithExpiry(
        "hero-banner",
        data?.data?.[0]?.heroImg,
        24 * 60 * 60 * 1000
      );
    } catch (error) {
      console.error("❌ Fetch banner error:", error);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const images = useMemo(() => [plant3, ...banners], [banners]);
  // const images = [plant1, plant2, plant3];
  const sectors = useMemo(() => images.length, [images]);
  const sectorDeg = useMemo(() => 360 / sectors, [sectors]);

  const norm = useCallback((a) => ((a % 360) + 360) % 360, []);
  const angleToSector = useCallback(
    (a) => Math.floor(norm(a) / sectorDeg),
    [norm, sectorDeg]
  );

  const updateStaticGeometry = useCallback(() => {
    const rx = rxRef.current;
    const ry = ryRef.current;

    if (svgRef.current) {
      svgRef.current.setAttribute(
        "viewBox",
        `0 0 ${rx * 2 + 40} ${ry * 2 + 40}`
      );
    }

    if (ellipseRef.current) {
      ellipseRef.current.setAttribute("cx", String(rx + 20));
      ellipseRef.current.setAttribute("cy", String(ry + 20));
      ellipseRef.current.setAttribute("rx", String(rx));
      ellipseRef.current.setAttribute("ry", String(ry));
    }

    if (knobRef.current) {
      const r = Math.min(rx, ry) / 7;
      const circle = knobRef.current.querySelector("circle");
      if (circle) circle.setAttribute("r", String(r));
    }

    dirtyRef.current = true;
  }, []);

  const applyManualModeStyles = useCallback(() => {
    const manual = manualModeRef.current;
    if (knobRef.current) {
      knobRef.current.style.cursor = manual ? "grab" : "default";
      knobRef.current.style.pointerEvents = manual ? "all" : "none";
    }
    if (rightSectionRef.current) {
      rightSectionRef.current.classList.toggle("cursor-grab", manual);
      rightSectionRef.current.classList.toggle("cursor-default", !manual);
    }
  }, []);

  const updateImageIfNeeded = useCallback(() => {
    const s = angleToSector(angleRef.current);
    if (s !== lastSectorRef.current) {
      lastSectorRef.current = s;
      if (imgRef.current) imgRef.current.src = images[s];
    }
  }, [angleToSector, images]);

  const getAngleFromPointer = useCallback((e) => {
    if (!stageRef.current || !svgRef.current) return 0;
    const svgRect = svgRef.current.getBoundingClientRect();
    const rx = rxRef.current;
    const ry = ryRef.current;
    const vbWidth = rx * 2 + 40;
    const vbHeight = ry * 2 + 40;
    const cxVB = rx + 20;
    const cyVB = ry + 20;
    const cxCSS = svgRect.left + (cxVB / vbWidth) * svgRect.width;
    const cyCSS = svgRect.top + (cyVB / vbHeight) * svgRect.height;

    const isTouch =
      e &&
      (("touches" in e && e.touches?.length) ||
        ("changedTouches" in e && e.changedTouches?.length));

    const touchPoint = isTouch
      ? ("touches" in e && e.touches[0]) ||
        ("changedTouches" in e && e.changedTouches[0])
      : null;

    const clientX = isTouch ? touchPoint.clientX : e.clientX;
    const clientY = isTouch ? touchPoint.clientY : e.clientY;

    const dx = (clientX ?? 0) - cxCSS;
    const dy = (clientY ?? 0) - cyCSS;

    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return deg;
  }, []);

  const start = useCallback(
    (e) => {
      if (!manualModeRef.current) return;
      e.preventDefault();
      draggingRef.current = true;
      const a = getAngleFromPointer(e);
      angleRef.current = a;
      updateImageIfNeeded();
      dirtyRef.current = true;
    },
    [getAngleFromPointer, updateImageIfNeeded]
  );

  const stop = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      manualModeRef.current = false;
      applyManualModeStyles();
    }, 4000);
  }, [applyManualModeStyles]);

  const move = useCallback(
    (e) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      const a = getAngleFromPointer(e);
      if (Math.abs(a - angleRef.current) < 0.5) return;
      angleRef.current = a;
      updateImageIfNeeded();
      dirtyRef.current = true;
      resetIdleTimer();
    },
    [getAngleFromPointer, updateImageIfNeeded, resetIdleTimer]
  );

  const lastTapRef = useRef(0);
  const lastTargetRef = useRef(null);
  const handleActivate = useCallback(
    (e) => {
      const now = Date.now();
      const tgt = e.currentTarget;
      const isDouble =
        lastTargetRef.current === tgt && now - lastTapRef.current < 300;
      lastTargetRef.current = tgt;
      lastTapRef.current = now;
      if (isDouble) {
        manualModeRef.current = !manualModeRef.current;
        draggingRef.current = false;
        applyManualModeStyles();
        if (manualModeRef.current) {
          if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
          resetIdleTimer();
        }
      }
    },
    [applyManualModeStyles, resetIdleTimer]
  );

  useEffect(() => {
    const el = rightSectionRef.current;
    if (el) {
      const compute = (width) => {
        const pad = 32;
        const usable = Math.max(0, width - pad);
        const newRx = Math.min(Math.max(usable / 3.2, 150), 520);
        const newRy = Math.max(24, Math.min(newRx / 5, 80));
        if (newRx !== rxRef.current || newRy !== ryRef.current) {
          rxRef.current = newRx;
          ryRef.current = newRy;
          updateStaticGeometry();
        }
      };

      resizeObsRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w =
            (entry.contentRect && entry.contentRect.width) || el.clientWidth;
          compute(w);
        }
      });

      resizeObsRef.current.observe(el);
    }

    const onMouseMove = (e) => move(e);
    const onMouseUp = () => stop();
    const onTouchMove = (e) => move(e);
    const onTouchEnd = () => stop();

    document.addEventListener("mousemove", onMouseMove, { passive: false });
    document.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchEnd, { passive: true });

    if (imgRef.current) imgRef.current.src = images[0];

    const startAuto = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      const durationMs = 2000;
      const fps = 60;
      const steps = Math.max(1, Math.round((fps * durationMs) / 1000));
      const perStep = sectorDeg / steps;
      const stepMs = Math.round(durationMs / steps);

      intervalRef.current = window.setInterval(() => {
        if (draggingRef.current || manualModeRef.current) return;
        const next = norm(angleRef.current + perStep);
        angleRef.current = next;
        updateImageIfNeeded();
        dirtyRef.current = true;
      }, stepMs);
    };

    startAuto();

    const loop = () => {
      if (dirtyRef.current && knobRef.current) {
        const rx = rxRef.current;
        const ry = ryRef.current;
        const rad = (angleRef.current * Math.PI) / 180;
        const px = rx + 20 + Math.cos(rad) * rx;
        const py = ry + 20 + Math.sin(rad) * ry;
        knobRef.current.setAttribute("transform", `translate(${px}, ${py})`);
        dirtyRef.current = false;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      if (resizeObsRef.current) resizeObsRef.current.disconnect();

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [images, sectorDeg, norm, move, stop, updateStaticGeometry, updateImageIfNeeded]);

  const onMouseDownKnob = useCallback(
    (e) => {
      e.preventDefault();
      start(e);
    },
    [start]
  );

  useEffect(() => {
    if (!imgRef.current) return;

    const updateImgHeight = () => {
      const rect = imgRef.current.getBoundingClientRect();
      setImgHeight(rect.height);
    };

    // Initial measure
    updateImgHeight();

    // Re-measure on resize
    window.addEventListener("resize", updateImgHeight);

    return () => {
      window.removeEventListener("resize", updateImgHeight);
    };
  }, [images]);

  const onTouchStartKnob = useCallback(
    (e) => {
      e.preventDefault();
      start(e);
    },
    [start]
  );

  useEffect(() => {
    const onResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="flex  flex-col md:flex-row items-center bg-white px-6 md:px-12 lg:px-16 pt-0  overflow-visible mx-auto  md:justify-center gap-8">
      {/* Right Section */}
      <div
        ref={rightSectionRef}
        onClick={handleActivate}
        onTouchStart={handleActivate}
        className="order-1 md:order-2 w-full md:w-1/2 pt-6 sm:pt-0  relative select-none flex justify-center items-end cursor-default"
      >
        <div
          ref={stageRef}
          className="w-full max-w-[800px] relative flex justify-center items-end"
          style={{ minHeight: "380px" }}
        >
          <div className="z-20 pointer-events-none w-full flex justify-center">
            <div
              className="relative"
              style={{ width: "min(440px, 100%)", aspectRatio: "4 / 5" }}
            >
              <img
                ref={imgRef}
                alt="Indoor Plant"
                className="absolute inset-x-0 top-auto h-[95%] w-full object-contain sm:scale-100 scale-[0.9] origin-bottom"
                style={{
                  bottom: isMobileView
                    ? `${ellipseGeom.ry - imgHeight * 0.07}px`
                    : `${ryRef.current}px`,
                }}
              />
            </div>
          </div>

          <svg
            ref={svgRef}
            width="100%"
            viewBox={`0 0 ${rxRef.current * 2 + 40} ${ryRef.current * 2 + 40}`}
            preserveAspectRatio="xMidYMax meet"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10"
          >
            <ellipse
              ref={ellipseRef}
              cx={rxRef.current + 20}
              cy={ryRef.current + 20}
              rx={rxRef.current}
              ry={ryRef.current}
              fill="none"
              stroke="rgba(0,0,0,.5)"
              strokeWidth="2"
            />
            <g
              ref={knobRef}
              style={{ cursor: "default", pointerEvents: "none" }}
              onMouseDown={onMouseDownKnob}
              onTouchStart={onTouchStartKnob}
            >
              <circle
                cx="0"
                cy="0"
                r={Math.min(rxRef.current, ryRef.current) / 7}
                fill="black"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Left Section */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="flex-1 order-1 space-y-6 text-center md:text-left"
      >
        <h2
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight"
          style={{ fontFamily: "serif" }}
        >
          Bring{" "}
          <span
            className="text-[#CB6129] md:text-5xl lg:text-6xl"
            style={{ fontFamily: "poppins" }}
          >
            Nature Home
          </span>{" "}
          with{" "}
          <span
            className="text-[#CB6129] md:text-5xl lg:text-6xl"
            style={{ fontFamily: "poppins" }}
          >
            Fresh Plants
          </span>{" "}
          & Stylish{" "}
          <span
            className="text-[#CB6129] md:text-5xl lg:text-6xl"
            style={{ fontFamily: "poppins" }}
          >
            Pots
          </span>
        </h2>
        <p className="text-sm sm:text-lg md:text-xl text-black max-w-lg ">
          Explore a curated collection of healthy indoor plants, decorative
          pots, gardening essentials, and plant‑care products designed to enrich
          your living space.
        </p>

        <button
          onClick={() => navigate("/ViewAll-Item")}
          className="bg-[#CB6129] text-white px-4 py-2 sm:px-8 sm:py-3 rounded-full font-semibold text-lg shadow-md hover:bg-green-800 transition duration-200"
        >
          BUY NOW
        </button>
      </motion.div>
    </div>
  );
});

export default Tree;
