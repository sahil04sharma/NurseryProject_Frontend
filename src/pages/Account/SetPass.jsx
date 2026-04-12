import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../network/backend";
import {
  getWithExpiry,
  updateValueKeepExpiry,
} from "../../utils/storageWithExpiry";
import { useAuth } from "../../ContextApi/AuthContext";
import ProcessingLoader from "../../components/Loader/ProcessingLoader";
import LeftSlideShow from "../../components/account/LeftSlideShow";
import BackToHome from "../../components/account/BackToHome";

export default function SetPassword() {
  const { loading, setLoading, setUser } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const user = getWithExpiry("user");

      if (!user || !user._id) {
        toast.error("User information not found. Please log in again.");
        navigate("/sign-in");
        return;
      }

      const { data } = await api.post("/auth/add-pass", {
        userId: user._id,
        password,
      });

      if (data.success) {
        updateValueKeepExpiry("user", data.user);
        setUser(data.user);
        toast.success(data.message || "Password set successfully!");
        navigate("/");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message ||
        "Failed to set password. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false); // stop loader
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-[#1a4122] flex">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image Section - HIDDEN ON MOBILE, VISIBLE ON MD AND ABOVE */}
        <LeftSlideShow />

        {/* Right: Form Section - FULL WIDTH ON MOBILE */}
        <div className="min-h-screen bg-linear-to-br from-[#0a1f0f] via-[#0f2815] to-[#1a4122] flex items-center justify-center p-6 md:p-8 lg:p-16 overflow-y-hidden">
          <div className="w-full max-w-md">
            <BackToHome />

            {/* Header */}
            <div className="mb-8 md:mb-10">
              <h2 className="heading-4 text-white mb-3 md:mb-4">
                Set Your Password
              </h2>
              <p className="text-body md:text-base text-gray-300">
                Create a strong password to secure your account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              {/* Password */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl px-4 md:px-5 py-3 md:py-4 pr-12 border border-white/20 bg-white/10 backdrop-blur-sm placeholder:text-gray-400 text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                />
                <span
                  data-testid="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-11 text-gray-300 cursor-pointer hover:text-white transition-colors"
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
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-xl px-4 md:px-5 py-3 md:py-4 pr-12 border border-white/20 bg-white/10 backdrop-blur-sm placeholder:text-gray-400 text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                />
                <span
                  data-testid="toggle-confirm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-11 text-gray-300 cursor-pointer hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="relative w-full bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold py-3 md:py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <ProcessingLoader /> : "Set Password"}
              </button>
            </form>

            {/* Password Requirements */}
            <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <p className="text-body text-gray-300 mb-2 text-body">
                Password must contain:
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• At least 8 characters</li>
                <li>• One uppercase letter (recommended)</li>
                <li>• One number (recommended)</li>
                <li>• One special character (recommended)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
