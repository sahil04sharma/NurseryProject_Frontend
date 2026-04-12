import React, { useEffect, useState } from "react";
import backend from "../../network/backend";
import { useNavigate } from "react-router-dom";

// Fallback data if API has no categories yet
const fallbackData = [
  {
    title: "Plants",
    path: "ViewAll-Item?category=plant",
    img: "https://i.pinimg.com/1200x/f7/a4/9f/f7a49f66efccc51573c3f6c617727da9.jpg",
  },
  {
    title: "Pots",
    path: "ViewAll-Item?category=Pot",
    img: "https://i.pinimg.com/1200x/55/4e/71/554e71d85e3b6c1aa3867d14d789551f.jpg",
  },
  {
    title: "Seeds",
    path: "ViewAll-Item?category=seed",
    img: "https://i.pinimg.com/1200x/1f/9e/b2/1f9eb2085f9eeed97624d8023f7c740e.jpg",
  },
];

const ArchCards = () => {
  const [cards, setCards] = useState(fallbackData);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // GET /about/all, expecting { success, data: [ { category: [ { name, categoryImg } ] } ] }
        const res = await backend.get("/about/all");
        const arr = Array.isArray(res?.data?.data) ? res.data.data : [];
        const first = arr[0];

        const apiCategories = Array.isArray(first?.category)
          ? first.category
          : [];

        if (alive && apiCategories.length > 0) {
          const mapped = apiCategories.map((c) => ({
            title: c?.name || "Category",
            img: c?.categoryImg || "",
            path: `/ViewAll-Item?category=${c?.name}`,
          }));
          setCards(mapped);
        }
      } catch {
        // On error, keep fallbackData silently
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="relative h-full z-20 flex flex-col sm:flex-row justify-center items-center gap-8 sm:px-4 py-8 lg:py-20">
      {cards.map((item, index) => (
        <div
          key={index}
          className="relative w-[80%] lg:w-full h-80 sm:h-80 lg:h-120 rounded-t-full overflow-hidden shadow-lg group"
        >
          {/* Background Image */}
          <img
            src={item.img}
            alt={item.title}
            className="w-full h-full object-cover text-2xl transition-transform duration-500 scale-105 group-hover:scale-115 hover:scale-110"
          />

          {/* Overlay */}
          <div
            className="absolute inset-0 flex flex-col justify-center items-center bg-black/20 bg-opacity-0 group-hover:bg-opacity-30 text-white text-center px-4
            before:absolute before:inset-0 before:bg-[#FF6B35] before:opacity-0 group-hover:before:opacity-30 before:transition-opacity before:duration-500"
          >
            <h2 className="overflow-hidden relative heading-2 mb-4">
              {item.title}
            </h2>
            <button
              onClick={() => navigate(item.path)}
              className="relative px-6 py-2 border border-white rounded-full cursor-pointer flex items-center gap-2 transition"
            >
              EXPLORE <span>→</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArchCards;
