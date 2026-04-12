import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Package, Home, ShoppingBag } from "lucide-react";

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen sm:pt-8 md:pt-6 lg:pt-0 px-4 bg-linear-to-b from-green-50 to-white flex flex-col items-center justify-center">
      {/* Success Icon + Animation */}
      <div className="text-center animate-fadeIn">
        <div className="relative h-14 md:h-24 flex items-center justify-center">
          <div className="w-12 h-12 md:w-22 md:h-22 rounded-full bg-green-100 flex items-center justify-center animate-bounce-slow shadow-md">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
        </div>
        <h2 className="md:mt-6 text-xl lg:text-3xl font-bold text-green-800">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mt-2">
          Thank you for shopping with us 🌱 Your orders are on the way!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-2xl">
        <button
          onClick={() => navigate("/my-profile/my-orders")}
          className="flex-1 py-2 md:py-3 bg-green-100 hover:bg-green-200 text-green-800 font-medium rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Package className="w-5 h-5" />
          View Orders
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex-1 py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          Continue Shopping
        </button>
      </div>

      {/* Footer Note */}
      <div className="mt-6 text-gray-500 text-sm flex items-center gap-1">
        <Home className="w-4 h-4 text-green-500" />
        <p>We’ll notify you when your order is shipped!</p>
      </div>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2s infinite;
        }
      `}</style>
    </div>
  );
}
