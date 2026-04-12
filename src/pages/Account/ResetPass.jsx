import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backend from "../../network/backend";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../ContextApi/AuthContext";
import ProcessingLoader from "../../components/Loader/ProcessingLoader";
import LeftSlideShow from "../../components/account/LeftSlideShow";
import BackToHome from "../../components/account/BackToHome";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, setLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Extract email from query params
  const email = new URLSearchParams(location.search).get("email");

  // SUBMIT NEW PASSWORD
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await backend.post("/auth/forgot/pass", {
        email,
        password,
      });

      toast.success("Password reset successful!");
      navigate("/sign-in");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-[#1a4122] flex">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
        {/* LEFT SLIDESHOW */}
        <LeftSlideShow />

        {/* RIGHT FORM */}
        <div className="min-h-screen bg-linear-to-br from-[#0a1f0f] via-[#0f2815] to-[#1a4122] flex items-center justify-center p-6 md:p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Mobile Back */}
            <BackToHome />

            {/* Header */}
            <div className="mb-8 md:mb-10">
              <h1 className="heading-4 text-white mb-3 md:mb-4">
                Reset Password
              </h1>
              <p className="text-body text-gray-300">
                Set a new secure password for{" "}
                <span className="text-white">{email}</span>
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div className="relative">
                <label className="block text-sm text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  className="w-full rounded-xl px-5 py-4 pr-12 border border-white/20 bg-white/10 backdrop-blur-sm placeholder:text-gray-400 text-white text-sm md:text-base focus:outline-none focus:border-green-500  transition-all duration-300"
                />
                <span
                  className="absolute right-4 top-12 text-gray-300 cursor-pointer hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-sm text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  className="w-full rounded-xl px-5 py-4 pr-12 border border-white/20 bg-white/10 backdrop-blur-sm placeholder:text-gray-400 text-white text-sm md:text-base focus:outline-none focus:border-green-500  transition-all duration-300"
                />
                <span
                  className="absolute right-4 top-12 text-gray-300 cursor-pointer hover:text-white"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] cursor-pointer"
              >
                {loading ? <ProcessingLoader /> : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
