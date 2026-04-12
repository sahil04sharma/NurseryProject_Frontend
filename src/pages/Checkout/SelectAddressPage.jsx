import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, PlusCircle, CheckCircle } from "lucide-react";
import { useOrder } from "../../ContextApi/OrderContext";
import { toast } from "react-toastify";
import { useAddress } from "../../ContextApi/AddressContext";

export default function SelectAddressPage() {
  const navigate = useNavigate();
  const { setAddress, orderData } = useOrder();
  const { addresses, fetchAddresses } = useAddress();
  const [selected, setSelected] = useState(null);

  const handleAddressSelect = (address) => {
    setAddress(address);
    if (!orderData.address) {
      toast.error("Please select delivery first!");
    }
    navigate("/checkout/payment");
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (!addresses.length > 0) return;

    const defaultAddress = addresses?.find(
      (address) => address.isDefault === true
    );
    if (defaultAddress) {
      setSelected(defaultAddress);
      return;
    }
    setSelected(addresses?.[0]);
  }, [addresses]);
  console.log(selected);
  return (
    <div className="min-h-screen pt-26 sm:pt-8 md:pt-6 lg:pt-0  bg-green-50 py-6 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-2 md:mb-6">
        <h2 className="text-md md:text-2xl lg:text-3xl font-bold text-green-800 flex items-center justify-center gap-2">
          <MapPin className="text-green-600 w-5 h-5 md:w-7 md:h-7" />
          Select Delivery Address
        </h2>
        <p className="text-gray-600 text-sm md:mt-1">
          Choose an existing address or add a new one.
        </p>
      </div>

      {/* Addresses */}
      <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address._id}
            onClick={() =>
              setSelected({
                _id: address._id,
                addressType: address.addressType,
                alternateNumber: address.alternateNumber,
                city: address.city,
                fullName: address.fullName,
                landmark: address.landmark,
                phoneNumber: address.phoneNumber,
                postalCode: address.postalCode,
                state: address.state,
                street: address.street,
              })
            }
            className={`cursor-pointer bg-white p-3 md:p-5 rounded-2xl shadow-md hover:shadow-lg transition relative border-2 ${
              selected?._id === address._id
                ? "border-green-600"
                : "border-transparent"
            }`}
          >
            <div className="flex justify-between items-start md:mb-2">
              <h3 className="text-sm md:text-lg font-semibold text-green-800">
                {address.fullName}
              </h3>
              {selected?._id === address._id && (
                <CheckCircle className="text-green-600 w-4 h-4 md:w-5 md:h-5" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">{address.street}</p>
            <p className="text-xs sm:text-sm text-gray-600">
              {address.city}, {address.state} - {address.pincode}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              📞 {address.phoneNumber}/{address.alternateNumber}
            </p>
          </div>
        ))}

        {/* Add New Address Card */}
        <div
          onClick={() => navigate("/add-address")}
          className="cursor-pointer bg-white p-3 md:p-5 rounded-2xl shadow-md hover:shadow-lg border-2 border-dashed border-green-400 flex flex-col items-center justify-center text-center transition"
        >
          <PlusCircle className="text-green-600 w-6 h-6 md:w-8 md:h-8 md:mb-2" />
          <h3 className="text-green-700 font-medium">Add New Address</h3>
        </div>
      </div>

      {/* Continue Button */}
      <div className="max-w-4xl mx-auto mt-4 md:mt-8">
        <button
          onClick={() => handleAddressSelect(selected)}
          disabled={!selected}
          className={`w-full py-2 sm:py-3 text-xs rounded-xl font-semibold text-white sm:text-lg transition-all duration-300 ${
            selected
              ? "bg-green-600 hover:bg-green-700 hover:shadow-lg"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
