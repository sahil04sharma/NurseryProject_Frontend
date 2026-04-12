import React from "react";
import backend from "../../network/backend";
import { toast } from "react-toastify";
import { useAuth } from "../../ContextApi/AuthContext";

const NotifyMe = ({ product }) => {
  const { loading, setLoading } = useAuth();

  const handleNotify = async () => {
    setLoading(true);
    try {
      const payload = {
        productId: product?.productId,
        variantLabel: product?.variantLabel,
        color: product?.color,
      };
      const { data } = await backend.post("/notify/add", payload);
      console.log(data);
      if (data.success) {
        toast.success(data?.message || "You will be notified.");
      }
    } catch (error) {
      console.log("Notify Me Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleNotify}
      disabled={loading}
      className=" bg-white border-2 border-[#1a4122] text-gray-900 px-8.5 py-1 md:py-2 rounded-lg font-medium hover:bg-[#1a4122] hover:text-white transition-colors text-center cursor-pointer"
    >
      {loading ? "Processing..." : "Notify Me"}
    </button>
  );
};

export default NotifyMe;
