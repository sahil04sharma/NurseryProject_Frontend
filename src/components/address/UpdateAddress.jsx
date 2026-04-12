import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import backend from "../../network/backend";
import LocationPicker from "./LocationPicker";
import { useAuth } from "../../ContextApi/AuthContext";

const UpdateAddress = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    alternateNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    addressType: "Home",
    isDefault: false,
    lat: null,
    lon: null,
  });
  const { loading, setLoading } = useAuth();
  const [errors, setErrors] = useState({});
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddressById(id);
  }, [id]);

  const fetchAddressById = async (id) => {
    try {
      const { data } = await backend.get(`/user/address/get-address/${id}`);
      if (data?.success) {
        console.log(data);
        setFormData(data.address);
      } else {
        console.warn("Address fetch succeeded but no address found.");
        toast.warning("No address details found");
      }
    } catch (error) {
      if (error.response) {
        console.error(
          `Error fetching address: ${error.response.status} - ${
            error.response.data?.message || error.response.statusText
          }`
        );
      } else {
        console.error("Error fetching address:", error.message);
      }
      toast.error("Failed to fetch address details");
    }
  };

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Validation logic
  const validateFields = () => {
    const newErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Full Name contains invalid characters.";
    }

    //  Phone Number Validations
    const phone = formData.phoneNumber.trim();

    if (!phone) {
      newErrors.phoneNumber = "Phone Number is required.";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phoneNumber = "Enter a valid Indian mobile number.";
    }

    //  Alternate Number validations
    const alt = (formData.alternateNumber || "").trim();
    if (alt) {
      if (!/[6-9]\d{9}$/.test(alt)) {
        newErrors.alternateNumber = "Enter a valid Indian mobile number.";
      } else if (alt === phone) {
        newErrors.alternateNumber =
          "Alternate Number must be different from Phone Number.";
      }
    }

    // Postal Code validation
    if (
      !formData.postalCode ||
      (typeof formData.postalCode === "string" && !formData.postalCode.trim())
    )
      newErrors.postalCode = "Postal Code is required.";
    else if (!/^\d{6}$/.test(formData.postalCode))
      newErrors.postalCode = "Postal code must be exactly 6 digits.";

    // Street Validation
    if (!formData.street.trim()) {
      newErrors.street = "Street is required.";
    } else if (formData.street.trim().length < 3) {
      newErrors.street = "Street address must be at least 3 characters.";
    }

    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state.trim()) newErrors.state = "State is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //  Update address fuction
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      toast.error("Please correct the highlighted errors.");
      return;
    }
    const payload = new FormData();
    if (formData.fullName) payload.append("fullName", formData.fullName);
    if (formData.phoneNumber)
      payload.append("phoneNumber", formData.phoneNumber);
    if (formData.alternateNumber)
      payload.append("alternateNumber", formData.alternateNumber);
    if (formData.street) payload.append("street", formData.street);
    if (formData.landmark) payload.append("landmark", formData.landmark);
    if (formData.city) payload.append("city", formData.city);
    if (formData.state) payload.append("state", formData.state);
    if (formData.postalCode) payload.append("postalCode", formData.postalCode);
    if (formData.addressType)
      payload.append("addressType", formData.addressType);
    payload.append("isDefault", formData.isDefault);
    if (formData.lat) payload.append("lat", formData.lat);
    if (formData.lon) payload.append("lon", formData.lon);
    setLoading(true);
    try {
      const { data } = await backend.put(
        `/user/address/update-address/${id}`,
        payload
      );
      if (data.success) {
        backend.clearCache("/user/address/getmy-address");
        toast.success(data.message || "Address Updated successfully");
        navigate(-1);
      } else {
        console.warn("[UpdateAddress] Failed update-address:", data);
        toast.error(data?.message || "Failed to update address");
      }
    } catch (error) {
      const errPayload = {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      };
      console.error("[AddAddress] Error adding address:", errPayload);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while updating address"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch city/state from postal code
  const getPostalCode = async (pin) => {
    handleChange("postalCode", pin);
    if (pin.length !== 6) return;
    try {
      const { data } = await backend.get(`/user/address/pincode/${pin}`);
      if (data.city && data.state) {
        handleChange("city", data.city);
        handleChange("state", data.state);
      }
    } catch (error) {
      const errPayload = {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      };
      console.error("[AddAddress] pincode lookup failed:", errPayload);
      toast.error("Try another pincode!");
      handleChange("city", "");
      handleChange("state", "");
    }
  };

  // Get current location using browser
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        if (!latitude && !longitude) {
          toast.error("Location fetch failed!");
          return;
        }
        console.log(latitude);
        console.log(longitude);
        try {
          const res = await backend.get(
            `/user/address/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );
          const address = res?.data?.address || {};
          handleChange("lat", latitude);
          handleChange("lon", longitude);
          handleChange(
            "city",
            address?.city || address?.town || address?.village || ""
          );
          handleChange("state", address?.state || "");
          handleChange("postalCode", address?.postcode || "");

          if (address.postcode) getPostalCode(address.postcode);
        } catch (err) {
          console.error("Reverse geocode failed:", err);
          toast.error("Failed to fetch location details");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Please allow location access");
        setLoadingLocation(false);
      }
    );
  };

  return (
    <div className="flex py-8 justify-center items-center min-h-screen pt-26 sm:pt-8 md:pt-0 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl px-6 py-4 w-full max-w-4xl"
      >
        <h2 className="text-2xl relative font-bold text-gray-800 mb-6 text-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute -left-2 md:left-0 top-1 md:top-2 text-xs sm:text-sm text-green-700 hover:underline sm:mb-4 cursor-pointer flex items-center gap-1"
          >
            ← Back
          </button>
          Update Address
        </h2>

        {/* 🌍 Use My Location Button */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={loadingLocation}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {loadingLocation ? (
              <span>Fetching location...</span>
            ) : (
              <>📍 Use My Current Location</>
            )}
          </button>
        </div>

        <LocationPicker
          center={
            formData.lat && formData.lon ? [formData.lat, formData.lon] : null
          }
          onLocationSelect={(lat, lon) => {
            handleChange("lat", lat);
            handleChange("lon", lon);
          }}
        />

        {/* ---- Form Fields ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-700 text-sm mb-1"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName || ""}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-gray-700 text-sm mb-1"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              type="text"
              value={formData.phoneNumber || ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              maxLength={10}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label
              htmlFor="postalCode"
              className="block text-gray-700 text-sm mb-1"
            >
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="postalCode"
              value={formData.postalCode || ""}
              onChange={(e) => getPostalCode(e.target.value.replace(/\D/g, ""))}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.postalCode ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
            )}
          </div>

          {/* Street */}
          <div>
            <label
              htmlFor="street"
              className="block text-gray-700 text-sm mb-1"
            >
              Street <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="street"
              value={formData.street || ""}
              onChange={(e) => handleChange("street", e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.street ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1">{errors.street}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-gray-700 text-sm mb-1">
              City/District <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              placeholder="City"
              value={formData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-gray-700 text-sm mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="State"
              type="text"
              id="state"
              value={formData.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.state ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">{errors.state}</p>
            )}
          </div>

          {/* Optional Fields */}
          <div>
            <label
              htmlFor="alternateNumber"
              className="block text-gray-700 text-sm mb-1"
            >
              Alternate Number
            </label>
            <input
              type="text"
              id="alternateNumber"
              value={formData.alternateNumber || ""}
              placeholder="Optional"
              onChange={(e) => handleChange("alternateNumber", e.target.value)}
              maxLength={10}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {errors.alternateNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.alternateNumber}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="landmark"
              className="block text-gray-700 text-sm mb-1"
            >
              Landmark
            </label>
            <input
              type="text"
              id="landmark"
              value={formData.landmark || ""}
              onChange={(e) => handleChange("landmark", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Address Type */}
          <div>
            <label
              htmlFor="addressType"
              className="block text-gray-700 text-sm mb-1"
            >
              Address Type <span className="text-red-500">*</span>
            </label>
            <select
              id="addressType"
              value={formData.addressType || "Home"}
              onChange={(e) => handleChange("addressType", e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Default */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.isDefault}
              onChange={() => handleChange("isDefault", !formData.isDefault)}
            />
            <span className="text-gray-700 text-sm">Set as Default</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-linear-to-r from-green-500 to-green-700 text-white py-2 rounded-lg hover:shadow-lg cursor-pointer"
        >
          {loading ? "Updating..." : "Update Address"}
        </button>
      </form>
    </div>
  );
};

export default UpdateAddress;
