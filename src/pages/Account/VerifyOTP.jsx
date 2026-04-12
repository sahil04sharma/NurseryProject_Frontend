import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setWithExpiry } from "../../utils/storageWithExpiry";
import backend from "../../network/backend";
import { useAuth } from "../../ContextApi/AuthContext";
import ProcessingLoader from "../../components/Loader/ProcessingLoader";
import LeftSlideShow from "../../components/account/LeftSlideShow";
import BackToHome from "../../components/account/BackToHome";

export default function VerifyOtp() {
  const { loading, setLoading } = useAuth();
  const email = JSON.parse(localStorage.getItem("email"));
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("First enter email to register.");
      navigate("/create-account");
      return;
    }
    setLoading(true);
    try {
      const { data } = await backend.post(`/auth/verify-otp`, {
        otp,
        email,
      });
      if (data.success) {
        Toster.success("OTP verified successfully");
        localStorage.removeItem("user"); // clear old user (if any)
        setWithExpiry("user", data.user, 7 * 24 * 60 * 60 * 1000); // Set user
        localStorage.removeItem("email");
        navigate("/set-pass");
      }
    } catch (error) {
      console.log("OTP verify error:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const { data } = await backend.post(`/auth/resend-otp`, { email });

      if (data.success) {
        Toster.success("OTP resent successfully");
      }
    } catch (error) {
      Toster.error(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-[#1a4122] flex">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image Section - HIDDEN ON MOBILE, VISIBLE ON MD AND ABOVE */}
        <LeftSlideShow />

        {/* Right: Form Section - FULL WIDTH ON MOBILE */}
        <div className="min-h-screen bg-linear-to-br from-[#0a1f0f] via-[#0f2815] to-[#1a4122] flex items-center justify-center p-6 md:p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Back button for mobile */}
            <BackToHome />

            {/* Header */}
            <div className="mb-8 md:mb-10">
              <h1 className="heading-4 text-white mb-3 md:mb-4">Verify OTP</h1>
              <p className="text-body text-gray-300">
                Enter the verification code sent to
              </p>
              <p className="text-body text-white font-semibold mt-1">{email}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitOTP} className="space-y-5 md:space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Enter Your OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  required
                  maxLength={6}
                  className="w-full rounded-xl px-4 md:px-5 py-3 md:py-4 border border-white/20 bg-white/10 backdrop-blur-sm placeholder:text-gray-400 text-white text-sm md:text-base text-center lg:text-2xl tracking-widest font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold py-3 md:py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
              >
                {loading ? <ProcessingLoader /> : "Verify OTP"}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="mt-6 text-center">
              <p className="text-body text-gray-300">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-white font-semibold hover:underline transition-all underline-offset-2"
                >
                  Resend OTP
                </button>
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <p className="text-body md:text-sm text-gray-300 text-center">
                For security reasons, the OTP will expire in 5 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
