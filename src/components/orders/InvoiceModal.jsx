import React, { useState } from "react";
import { motion } from "framer-motion";
import backend from "../../network/backend";
import { X } from "lucide-react";
import { useAuth } from "../../ContextApi/AuthContext";
import { toast } from "react-toastify";

const InvoiceModal = ({ orderId, onClose }) => {
  if (!orderId) return null;
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const previewInvoice = async (orderId) => {
    setLoading(true);
    try {
      const res = await backend.get(
        `/order-invoice/invoice/${orderId}/download`,
        {
          responseType: "blob",
        }
      );

      const fileURL = URL.createObjectURL(res.data);
      window.open(fileURL, "_blank");
      onClose();
    } catch (error) {
      console.log("Preview Invoice failed.", error);
      toast.error("Invoice preview failed. Try again later!");
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (orderId) => {
    setDownloading(true);
    try {
      const res = await backend.get(
        `/order-invoice/invoice/${orderId}/download`,
        {
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");

      a.href = url;
      a.download = `Invoice-${orderId}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.log("Invoice download failed.", error);
      toast.error("Invoice download failed. Try again later!");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-6 z-1000">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white relative rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
        <h3 className=" text-sm sm:text-xl font-semibold text-gray-800 mb-3">
          Order Invoice
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-5">
          You can Preview or Download Order Invoice.
        </p>

        <div className="flex justify-center text-xs sm:text-sm gap-4">
          <button
            onClick={() => previewInvoice(orderId)}
            disabled={loading}
            className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-red-700 transition"
          >
            {loading ? "Processing..." : "Preview"}
          </button>
          <button
            disabled={loading}
            onClick={() => downloadInvoice(orderId)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            {downloading ? "Downloading..." : "Download"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InvoiceModal;
