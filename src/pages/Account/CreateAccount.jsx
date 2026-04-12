import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backend from "../../network/backend";
import { toast } from "react-toastify";
import { useAuth } from "../../ContextApi/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import { setWithExpiry } from "../../utils/storageWithExpiry";
import ProcessingLoader from "../../components/Loader/ProcessingLoader";
import GoogleLoginButton from "../../components/account/GoogleLoginButton";
import LeftSlideShow from "../../components/account/LeftSlideShow";

export default function CreateAccount() {
  const { loading, setLoading, setUser } = useAuth();
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Google login
  const responseGoogle = async (authResponse) => {
    setLoading(true);
    try {
      console.log("Google auth response: ", authResponse);
      if (authResponse["code"]) {
        // Send code to backend to get token & user info.
        const { data } = await backend.post("/auth/googleLogin", {
          code: authResponse["code"],
        });
        setWithExpiry("user", data?.user, 7 * 24 * 60 * 60 * 1000);
        setUser(data?.user);
        toast.success(data?.message || "Login Successfully.");
        navigate("/my-profile");
      }
    } catch (error) {
      console.error("Google Register Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  // Register with email → send OTP → hydrate if backend already set session
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { email };
    try {
      const response = await backend.post("/auth/register", payload);
      const data = response?.data;

      if (data?.success) {
        localStorage.setItem(
          "email",
          JSON.stringify(data?.pendingUser?.email ?? email)
        );
        toast.success("OTP sent to your email");
        navigate("/verify-otp");
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 409) {
        // User already exists
        setAlreadyRegistered(true);
      } else {
        toast.error(error?.response?.data?.message || "Please try again.");
      }
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-[#1a4122] flex">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
        <LeftSlideShow />

        {/* Right: Form Section - FULL WIDTH ON MOBILE */}
        <div className="min-h-screen bg-linear-to-br from-[#0a1f0f] via-[#0f2815] to-[#1a4122] flex items-center justify-center p-6 md:p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Back button for mobile - ONLY VISIBLE ON MOBILE */}
            <button
              onClick={() => navigate("/")}
              className="md:hidden mb-6 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-medium px-4 py-2 rounded-lg shadow-lg transition-all duration-300 border border-white/30 cursor-pointer"
              aria-label="Back to website"
            >
              ← Back to website
            </button>

            {/* Header */}
            <div className="mb-8 md:mb-10">
              <h1 className="text-xl md:text-3xl roboto-serif text-white mb-3 md:mb-4">
                Create an account
              </h1>
              <p className="text-body md:text-base text-gray-300">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/sign-in")}
                  className="text-white font-semibold hover:underline transition-all underline-offset-2 cursor-pointer"
                >
                  Log in
                </button>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              <div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  autoFocus={true}
                  className="w-full rounded-xl px-4 md:px-5 py-3 md:py-4 border border-white/20 bg-white/10 backdrop-blur-sm placeholder:text-gray-400 text-white text-sm md:text-base focus:outline-none focus:border-green-500  transition-all duration-300"
                />
              </div>

              {alreadyRegistered && (
                <p className="text-red-300 bg-red-500/10 p-3 rounded-lg border border-red-400/30 text-sm">
                  User already registered. Please{" "}
                  <button
                    onClick={() => navigate("/sign-in")}
                    className="underline font-semibold text-red-200 hover:text-red-100"
                  >
                    log in
                  </button>
                  .
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="w-full bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold py-3 md:py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? <ProcessingLoader /> : "Create account"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6 md:my-8">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-3 md:px-4 text-xs md:text-sm text-gray-400">
                Or register with
              </span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            {/* Social Buttons */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 text-sm md:text-base cursor-pointer"
            >
              <GoogleLoginButton /> Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
