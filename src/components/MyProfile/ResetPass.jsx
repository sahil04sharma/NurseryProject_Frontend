import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../network/backend";
import { toast } from "react-toastify";
import { useAuth } from "../../ContextApi/AuthContext";
import ProcessingLoader from "../Loader/ProcessingLoader";

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const { loading, setLoading } = useAuth();

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot", { email });
      toast.success(res.data?.message || "OTP sent");
      setStep(2);
    } catch {
      toast.error("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot/verify", { email, otp });
      toast.success(res.data?.message || "OTP Verified!");
      setStep(3);
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot/pass", { email, password });
      toast.success(res.data?.message || "Password updated!");
    } catch {
      toast.error("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" py-10 px-3 flex justify-center h-full w-full">
      <div className="bg-white shadow-xl rounded-2xl p-6 lg:p-8 w-full h-fit max-w-lg">
        {/* --------- Heading --------- */}
        <h1 className="text-xl lg:text-2xl font-bold text-gray-800 text-center mb-2">
          Reset Your Password
        </h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Complete the steps below to recover your account.
        </p>

        {/* --------- Step Indicator --------- */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-3 h-3 rounded-full ${
                  step === num ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* --------- FORM CONTENT --------- */}
        <div className="space-y-5">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm text-gray-600 font-medium mb-2">
                Registered Email
              </label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border focus:border-gray-50 focus:ring-1 focus:ring-green-600 focus:outline-none rounded-lg text-sm"
              />

              <button
                onClick={handleSendEmail}
                disabled={loading}
                className="mt-4 w-full py-3 bg-green-600 outline-green-600 hover:bg-green-700 
                text-white rounded-lg font-medium transition cursor-pointer"
              >
                {loading ? <ProcessingLoader /> : "Send OTP"}
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm text-gray-600 font-medium mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="Enter the OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 bg-white border focus:border-gray-50 focus:ring-1 focus:ring-green-600 focus:outline-none rounded-lg text-sm"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="mt-4 w-full py-3 bg-green-600 outline-green-600 hover:bg-green-700 
                text-white rounded-lg font-medium transition cursor-pointer"
              >
                {loading ? <ProcessingLoader /> : "Verify OTP"}
              </button>

              <button
                onClick={() => setStep(1)}
                className="mt-3 w-full py-3 bg-gray-200 hover:bg-gray-300 
                text-gray-700 rounded-lg font-medium transition cursor-pointer"
              >
                Back
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
              {/* New password */}
              <div className="relative">
                <label className="block text-sm text-gray-600 font-medium mb-2">
                  New Password
                </label>

                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Create new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 focus:ring-1 focus:ring-green-600 focus:outline-none rounded-lg text-sm"
                />

                <span
                  className="absolute right-4 bottom-2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Confirm password */}
              <div className="relative">
                <label className="block text-sm text-gray-600 font-medium mb-2">
                  Confirm Password
                </label>

                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-600 focus:outline-none text-sm"
                />

                <span
                  className="absolute right-4 bottom-2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                >
                  {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-3 outline-green-600 bg-green-600 hover:bg-green-700 
                text-white rounded-lg font-medium transition cursor-pointer"
              >
                {loading ? <ProcessingLoader /> : "Update Password"}
              </button>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 
                text-gray-700 rounded-lg font-medium transition cursor-pointer"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
