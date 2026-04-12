import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BackToHome = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/")}
      className="md:hidden mb-3 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white text-xs font-medium px-2 py-2 rounded-lg shadow-lg transition-all duration-300 border border-white/30 flex items-center gap-2"
    >
      <FaArrowLeft /> Back to website
    </button>
  );
};

export default BackToHome;
