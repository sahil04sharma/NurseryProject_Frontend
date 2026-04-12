import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LoginPromptModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg p-5 sm:p-6 md:p-8 text-center"
      >
        {/* Heading */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
          Join Our Plant Community
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 mb-5">
          Login to save plants, post updates, and connect with plant lovers.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-md border text-sm sm:text-base"
          >
            Maybe Later
          </button>

          <button
            onClick={() => navigate("/sign-in")}
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-green-600 text-white text-sm sm:text-base hover:bg-green-700 transition"
          >
            Login / Sign Up
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPromptModal;


