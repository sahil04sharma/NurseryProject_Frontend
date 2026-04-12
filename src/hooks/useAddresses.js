import { useState } from "react";
import backend from "../network/backend";
import { toast as Toster } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../ContextApi/AuthContext";

export default function useAddresses() {
  const { setLoading } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    address: null,
  });
  const navigate = useNavigate();

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const { data } = await backend.cachedGet("/user/address/getmy-address");

      if (data?.success && data?.addresses) {
        setAddresses(data.addresses || []);
      } else {
        Toster.error(data?.message || "Failed to fetch addresses");
      }
    } catch (e) {
      Toster.error(e?.response?.data?.message || "Error fetching addresses");
    } finally {
      setLoading(false);
    }
  };

  const editAddress = (address) => {
    const id = address?.id || address?._id;
    if (!id) return;
    navigate(`/update-address/${id}`);
  };

  const requestDelete = (address) => {
    setDeleteDialog({ isOpen: true, address });
  };

  const confirmDelete = async () => {
    const id = deleteDialog.address?.id || deleteDialog.address?._id;
    if (!id) return;

    try {
      const res = await backend.delete(`/user/address/delete/${id}`);
      if (res?.data?.success) {
        Toster.success(res.data.message || "Address deleted");
        setAddresses((prev) => prev.filter((a) => (a.id || a._id) !== id));
        backend.clearCache("/user/address/getmy-address");
      } else {
        Toster.error(res?.data?.message || "Failed to delete address");
      }
    } catch (e) {
      Toster.error(e?.response?.data?.message || "Failed to delete address");
    } finally {
      setDeleteDialog({ isOpen: false, address: null });
    }
  };

  const cancelDelete = () => setDeleteDialog({ isOpen: false, address: null });

  return {
    addresses,
    setAddresses,
    editAddress,
    requestDelete,
    confirmDelete,
    cancelDelete,
    deleteDialog,
    fetchAddresses,
  };
}
