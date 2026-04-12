import React, { useEffect, useRef, useState } from "react";
import slides from "../../assets/slides";
import { useNavigate } from "react-router-dom";

const LeftSlideShow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const paginate = (newDirection) => {
    const newIndex =
      (currentSlide + newDirection + slides.length) % slides.length;
    setCurrentSlide(newIndex);
    setPage(([p]) => [p + newDirection, newDirection]);
  };

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    intervalRef.current = setInterval(() => {
      paginate(1);
    }, 4000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentSlide, slides.length]);

  return (
    <div className="hidden md:block h-screen relative overflow-hidden">
      <img
        src={slides[currentSlide].image}
        alt={slides[currentSlide].title}
        className="w-full h-full object-cover transition-all duration-700"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>

      {/* Back to website button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 z-30 bg-white/20 backdrop-blur-md hover:bg-white/30 text-[#434242] font-medium px-5 py-2.5 rounded-lg shadow-lg transition-all duration-300 border border-white/30 cursor-pointer"
        aria-label="Back to website"
      >
        Back to website
      </button>

      {/* Slide Text Overlay */}
      <div className="absolute left-8 bottom-24 z-20 text-white">
        <h2 className="heading-2 mb-2">
          {slides[currentSlide].title === "Green Spaces" &&
            "Capturing Moments,"}
          {slides[currentSlide].title === "Fresh Beginnings" &&
            "Fresh Beginnings,"}
          {slides[currentSlide].title === "Nature Indoors" && "Nature Indoors,"}
        </h2>
        <h2 className="heading-2">
          {slides[currentSlide].title === "Green Spaces" && "Creating Memories"}
          {slides[currentSlide].title === "Fresh Beginnings" &&
            "Endless Growth"}
          {slides[currentSlide].title === "Nature Indoors" && "Natural Living"}
        </h2>
      </div>

      {/* Slide Counter */}
      <div className="absolute left-8 bottom-8 z-20">
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (index === currentSlide) return;
                const newDirection = index > currentSlide ? 1 : -1;
                setCurrentSlide(index);
                setPage(([p]) => [p + newDirection, newDirection]);
              }}
              className={`h-1 rounded-full transition-all duration-300 hover:bg-white/80 ${
                index === currentSlide ? "w-12 bg-white" : "w-8 bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSlideShow;
