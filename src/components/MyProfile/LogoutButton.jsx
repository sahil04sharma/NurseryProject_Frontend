import { useNavigate } from "react-router-dom";
import backend from "../../network/backend";
import { useAuth } from "../../ContextApi/AuthContext";
import { doLocalCleanup } from "../../helper/doLocalCleanup";
import { LogOutIcon } from "lucide-react";

export default function LogoutButton({
  className = "",
  label = "Logout",
  onLoggedOut,
}) {
  const { loading, setLoading, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Try server-side logout if your API supports it; ignore failures
      const { data } = await backend.post?.("/auth/logout").catch(() => {});
      if (data?.success) {
        doLocalCleanup();
        setUser(null);
        navigate("/sign-in", { replace: true });
      }
    } finally {
      setLoading(false);
      onLoggedOut?.();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 px-2 md:px-4 py-2  disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${className}`}
      aria-label="Logout"
    >
    <LogOutIcon />  {loading ? "Logging out..." : label}
    </button>
  );
}
