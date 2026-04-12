import React from "react";
import { useNavigate } from "react-router-dom";

const LesPalmiers = () => {
  const navigate = useNavigate();
  const sections = [
    {
      id: 1,
      title: "ABOUT US",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=400&fit=crop",
    },
    {
      id: 2,
      title: "WHY WORK WITH US?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
      image:
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&h=400&fit=crop",
    },
    {
      id: 3,
      title: "GET IN TOUCH!",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image:
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=500&h=400&fit=crop",
    },
  ];

  return (
    <div className="relative w-full bg-[#1A4122] py-16 overflow-hidden">
      {/* Mobile View - Horizontal Text at Top */}
      {/* Mobile + Tablet Top Heading */}
<div className="block lg:hidden mb-8 px-8">
  <h1 className="text-[#d8efc4] heading-1 tracking-wider">
    Green Nest
  </h1>
</div>


      {/* Container with proper centering */}
      <div className="flex items-center mx-4 md:mx-10 justify-center">
        {/* Vertical Text on Left - Desktop/Tablet Only */}
        {/* Desktop Vertical Heading Only */}
<div className="hidden lg:block shrink-0 mr-16">
  <h1
    className="text-[#d8efc4] heading-1 tracking-wider"
    style={{
      writingMode: "vertical-lr",
      textOrientation: "mixed",
      letterSpacing: "0.1em",
      transform: "rotate(180deg)",
    }}
  >
    Green Nest
  </h1>
</div>


        {/* Main Content Sections */}
        <div className="flex-1 max-w-6xl">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex flex-col md:flex-row items-start gap-8 ${
                index === sections.length - 1 ? "mb-8" : "mb-12"
              }`}
            >
              {/* Text Content - Left Side */}
              <div className="flex-1">
                <h3 className="text-[#d8efc4]  heading-3 mb-4 tracking-wide">
                  {section.title}
                </h3>
                <p className="text-[#d8efc4] text-body leading-relaxed opacity-90">
                  {section.content}
                </p>
              </div>

              {/* Image - Right Side */}
              <div className="w-full md:w-[280px] lg:w-[320px] shrink-0">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-60 md:h-[200px] lg:h-[220px] object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          ))}

          {/* Book A Call Button - Center on Mobile, Left on Desktop */}
          <div className="flex justify-center md:justify-start mt-4">
            <button
              onClick={() => navigate("/Contact-us")}
              className="px-12 py-3 border-2 border-[#d8efc4] text-[#d8efc4] cursor-pointer text-sm font-medium tracking-widest rounded-full hover:bg-[#d8efc4] hover:text-[#1A4122] transition-all duration-300"
            >
              BOOK A CALL!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LesPalmiers;
