import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backend from "../../network/backend";
import { toast } from "react-toastify";
import { useAuth } from "../../ContextApi/AuthContext";
import { doLocalCleanup } from "../../helper/doLocalCleanup";
import { motion } from "framer-motion";

export default function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const { loading, setLoading, setUser } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { data } = await backend.post("/auth/delete");
      await backend.post?.("/auth/logout");
      if (data.success) {
        doLocalCleanup();
        setUser(null);
        toast.success("Account deleted successfully.");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Account deletion failed!");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6  w-full">
        <h1 className="text-md md:text-xl lg:text-2xl font-bold text-red-600 mb-4">
          Delete Your Account
        </h1>

        {/* Privacy + Account Deletion Information */}
        <div className="space-y-3 text-gray-700 leading-relaxed text-xs md:text-base">
          <p>
            Deleting your account is a <strong>permanent</strong> action. Once
            deleted, your account cannot be recovered.
          </p>

          <h2 className="font-semibold text-sm md:text-lg mt-4">
            What happens when you delete your account?
          </h2>
          <ul className="list-disc pl-2 md:pl-4 space-y-1">
            <li>Your profile information will be permanently removed.</li>
            <li>
              Your saved addresses, wishlist, and cart details will be deleted.
            </li>
            <li>
              Your order history will be anonymized for legal and audit
              purposes.
            </li>
            <li>
              All preferences, settings, and personal data will be erased.
            </li>
          </ul>

          <h2 className="font-semibold text-sm md:text-lg mt-4">
            Data Retention Policy
          </h2>
          <ul className="list-disc pl-2 md:pl-4 space-y-1">
            <li>
              Some order-related information may be kept (without your identity)
              for tax, fraud prevention, and compliance reasons.
            </li>
            <li>
              Refund or dispute-related information may be temporarily retained
              until all open processes are completed.
            </li>
          </ul>

          <h2 className="font-semibold text-sm md:text-lg mt-4">
            Before deleting your account
          </h2>
          <ul className="list-disc pl-2 md:pl-4 space-y-1">
            <li>Make sure no pending orders or returns exist.</li>
            <li>Download any invoices you may need for future reference.</li>
            <li>
              Your login access will be removed immediately after deletion.
            </li>
          </ul>

          <p className="text-red-600 font-medium mt-3">
            This process is irreversible. Please proceed only if you fully
            understand the consequences.
          </p>
        </div>

        {/* Delete Button */}
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white text-sm md:text-lg font-semibold py-3 rounded-xl mt-6"
          onClick={() => {
            setOpen(true);
          }}
        >
          Delete My Account
        </button>

        {/* Confirmation Dialog */}
        {open && (
          <motion.div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-1000">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
              <h3 className="text-xl font-bold text-red-600 mb-3">
                Confirm Account Deletion
              </h3>

              <p className="text-gray-700 mb-6">
                Are you sure you want to permanently delete your account? This
                action cannot be undone.
              </p>

              <div className="flex gap-4">
                <button
                  className="w-1/2 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  className="w-1/2 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
