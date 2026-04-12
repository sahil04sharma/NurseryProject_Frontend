import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backend from "../../network/backend";
import { toast } from "react-toastify";
import { useAuth } from "../../ContextApi/AuthContext";
import ProcessingLoader from "../../components/Loader/ProcessingLoader";
import LeftSlideShow from "../../components/account/LeftSlideShow";
import BackToHome from "../../components/account/BackToHome";

export default function ForgotPassword() {
  const { loading, setLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = send email, 2 = verify OTP
  const navigate = useNavigate();

  // STEP 1 → Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await backend.post("/auth/forgot", { email });
      toast.success("OTP sent successfully!");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 → Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await backend.post("/auth/forgot/verify", {
        email,
        otp,
      });

      toast.success("OTP verified!");
      navigate("/reset-password?email=" + email);
    } catch (err) {
      console.log(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-[#1a4122] flex">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
        {/* LEFT SLIDESHOW (same as Sign In) */}
        <LeftSlideShow />

        {/* RIGHT FORM SECTION */}

        <div className="min-h-screen bg-linear-to-br from-[#0a1f0f] via-[#0f2815] to-[#1a4122] flex items-center justify-center p-6 md:p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Mobile back button */}
            <BackToHome />

            {/* HEADER */}
            <div className="mb-8 md:mb-10">
              <h1 className="heading-4 text-white mb-3 md:mb-4">
                Forgot Password
              </h1>
              <p className="text-body text-gray-300">
                {step === 1
                  ? "Enter your registered email to receive an OTP."
                  : "Enter the OTP sent to your email."}
              </p>
            </div>

            {/* STEP 1 – EMAIL INPUT   */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl px-4 md:px-5 py-3 md:py-4 border border-white/20 bg-white/10 backdrop-blur-sm placeholder:text-gray-400 text-white text-sm md:text-base focus:outline-none focus:border-green-500  transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] cursor-pointer"
                >
                  {loading ? <ProcessingLoader /> : "Send OTP"}
                </button>
              </form>
            )}

            {/* STEP 2 – OTP INPUT     */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <p className="text-gray-300">
                  OTP sent to{" "}
                  <span className="text-white font-semibold">{email}</span>
                </p>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full rounded-xl px-4 md:px-5 py-3 md:py-4 border border-white/20 bg-white/10 backdrop-blur-sm placeholder:text-gray-400 text-white text-sm md:text-base focus:outline-none focus:border-green-500  transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] cursor-pointer"
                >
                  <div className="h-6">
                    {loading ? <ProcessingLoader /> : "Verify OTP"}
                  </div>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
