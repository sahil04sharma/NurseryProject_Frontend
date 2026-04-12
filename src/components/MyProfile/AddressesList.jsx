import { MapPin, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAddress } from "../../ContextApi/AddressContext";
import { useAuth } from "../../ContextApi/AuthContext";

export default function AddressesList() {
  const {
    addresses,
    editAddress,
    requestDelete,
    confirmDelete,
    cancelDelete,
    deleteDialog,
    fetchAddresses,
  } = useAddress();
  const { loading } = useAuth();
  const navigate = useNavigate();

  // Load user address
  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl lg:rounded-3xl p-4 lg:mx-0 mx-4 lg:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6 gap-4 mx-2 lg:mx-0">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-700">
            Saved Addresses
          </h2>
          <button
            onClick={() => navigate("/add-address")}
            className="bg-linear-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow text-sm lg:text-base"
          >
            Add New Address
          </button>
        </div>

        <div className="space-y-4 mx-2 lg:mx-0">
          {loading ? (
            <p
              data-testid="loading-address"
              className="text-gray-500 text-center"
            >
              Loading addresses...
            </p>
          ) : addresses.length > 0 ? (
            addresses.map((address, index) => (
              <div
                key={index}
                className="relative p-3 lg:p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="absolute top-2 sm:top-3 right-3 flex gap-2">
                  <button
                    onClick={() => editAddress(address)}
                    className="bg-blue-100 w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center rounded hover:bg-blue-200"
                  >
                    <Edit2 className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                  </button>
                  <button
                    onClick={() => requestDelete(address)}
                    className="w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center rounded bg-red-100 hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 lg:w-10 lg:h-10 bg-linear-to-r from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>

                  <div className="ml-3 lg:ml-4 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <p className="text-xs lg:text-base font-semibold text-gray-700">
                        {address.fullName}
                      </p>
                      {address.isDefault && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium self-start">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-xs lg:text-base text-gray-600 wrap-break-word">
                      {address.street}, {address.landmark}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500">
                      {address.city}, {address.state} - {address.postalCode}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500">
                      {address.addressType} | {address.phoneNumber}
                      {address.alternateNumber
                        ? ` / ${address.alternateNumber}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No saved addresses found.
            </p>
          )}
        </div>
      </div>

      {deleteDialog.isOpen && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl flex flex-col justify-center items-center"
          >
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this address?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
