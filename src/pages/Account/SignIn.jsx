import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../network/backend";
import { toast } from "react-toastify";
import { useAuth } from "../../ContextApi/AuthContext";
import { setWithExpiry } from "../../utils/storageWithExpiry";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleLoginButton from "../../components/account/GoogleLoginButton";
import LeftSlideShow from "../../components/account/LeftSlideShow";
import ProcessingLoader from "../../components/Loader/ProcessingLoader";
import BackToHome from "../../components/account/BackToHome";

export default function SignIn() {
  const { loading, setLoading, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // Handle input change
  const handleOnChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  // Google login
  const responseGoogle = async (authResponse) => {
    setLoading(true);
    try {
      // console.log("Google auth response: ", authResponse);
      if (authResponse["code"]) {
        // Send code to backend to get token & user info.
        const { data } = await api.post("/auth/googleLogin", {
          code: authResponse["code"],
        });
        setWithExpiry("user", data?.user, 7 * 24 * 60 * 60 * 1000);
        setUser(data?.user);
        toast.success(data?.message || "Login Successfully.");
        navigate("/my-profile");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  // Login via email password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      if (data.success) {
        if (data?.user)
          setWithExpiry("user", data.user, 7 * 24 * 60 * 60 * 1000);
        setUser(data.user);
        toast.success(data.message || "Login successful");
        navigate("/my-profile");
      }
    } catch (error) {
      console.error(" LOGIN ERROR:", error);
      if (
        error?.response?.status === 500 &&
        error?.response?.data?.message === "data and hash arguments required"
      ) {
        toast.error("Invalid Credentials! Reset Password.");
      } else if (error?.status === 500) {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#1a4122] flex">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image Section - HIDDEN ON MOBILE, VISIBLE ON MD AND ABOVE */}
        <LeftSlideShow />

        {/* Right: Form Section - FULL WIDTH ON MOBILE */}
        <div className="h-screen overflow-hidden bg-linear-to-br from-[#0a1f0f] via-[#0f2815] to-[#1a4122] flex items-center justify-center p-6 md:p-8 lg:p-16">
          <div className="w-full max-w-md">
            <BackToHome />

            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-xl md:text-3xl roboto-serif text-white mb-1 md:mb-4">
                Sign In
              </h1>
              <p className="text-body text-gray-300">
                Not a Member?{" "}
                <button
                  onClick={() => navigate("/create-account")}
                  className="text-white font-semibold hover:underline transition-all underline-offset-2 cursor-pointer"
                >
                  Create Account
                </button>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="username"
                  value={formData.email}
                  onChange={handleOnChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl px-4 md:px-5 py-3 md:py-4 border border-white/20 bg-white/10 backdrop-blur-sm placeholder:text-gray-400 text-white text-sm md:text-base focus:outline-none focus:border-green-500  transition-all duration-300"
                />
              </div>

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
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleOnChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl px-4 md:px-5 py-3 md:py-4 border border-white/20 bg-white/10 backdrop-blur-sm placeholder:text-gray-400 text-white text-sm md:text-base focus:outline-none focus:border-green-500  transition-all duration-300"
                />
                <span
                  data-testid="toggle-password" // <--- ADD THIS LINE
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-11 text-gray-300 cursor-pointer..."
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </span>
              </div>

              {/* Forgot Password Button */}
              <div className="flex justify-end -mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-pass")}
                  className="text-red-400 hover:text-red-500 text-sm font-medium transition-all cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold py-3 md:py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] cursor-pointer"
              >
                {loading ? <ProcessingLoader /> : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6 md:my-8">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-3 md:px-4 text-xs md:text-sm text-gray-400">
                Or sign in with
              </span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            {/* Social Buttons */}
            <div onClick={handleGoogleLogin} className="w-full">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 text-sm md:text-base cursor-pointer">
                <GoogleLoginButton /> Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
