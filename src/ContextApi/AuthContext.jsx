import { createContext, useContext, useState, useEffect } from "react";
import { getWithExpiry, setWithExpiry } from "../utils/storageWithExpiry";
import backend from "../network/backend";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getWithExpiry("user"));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const savedUser = getWithExpiry("user");
      if (savedUser) {
        setUser(savedUser);
        return;
      }
      const { data } = await backend.cachedGet("/user/get-profile");
      if (data?.success) {
        setUser(data?.userData);
        setWithExpiry("user", data?.userData, 24 * 60 * 60 * 1000);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) return;
    fetchUserProfile();
  }, []);

  const value = {
    user,
    error,
    loading,
    setUser,
    setError,
    setLoading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
