import { useEffect, useState } from "react";
import backend from "../network/backend";
import { toast, toast as Toster } from "react-toastify";
import { useAuth } from "../ContextApi/AuthContext";
import { updateValueKeepExpiry } from "../utils/storageWithExpiry";

export default function useProfile() {
  const [userProfile, setUserProfile] = useState(false);
  const { user, setLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [fields, setFields] = useState({
    name: "",
    contactNumber: "",
    birthdate: "",
    gender: "",
    image: false,
    isBirthdateEdited: false,
    isGenderEdited: false,
  });

  const setField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setUserProfile(user);
    setFields((prev) => ({
      ...prev,
      name: user?.name || "",
      contactNumber: user?.contact || "",
      birthdate: user?.dob || "",
      gender: user?.gender || "",
    }));
  }, []);

  const saveProfile = async () => {
    if (!userProfile.contactNumber && !fields.contactNumber) {
      toast.error("Phone number is required");
      return;
    } else if (
      !userProfile.contactNumber &&
      !/^[6-9]\d{9}/.test(fields.contactNumber ?? userProfile.contactNumber)
    ) {
      toast.error("Enter a valid Indian mobile number.");
      return;
    }
    const formData = new FormData();
    if (fields.name) formData.append("name", fields.name);
    if (fields.contactNumber) formData.append("contact", fields.contactNumber);
    if (!userProfile.dob) formData.append("dob", formatDate(fields.birthdate));
    if (!userProfile.gender) formData.append("gender", fields.gender);
    if (fields.image) formData.append("image", fields.image);
    setLoading(true);
    try {
      const res = await backend.post("/user/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = res.data;
      if (data?.success) {
        setUserProfile(data.user);
        updateValueKeepExpiry("user", data.user);

        Toster.success(data.message || "Profile updated successfully");
        setIsEditing(false);
      } else {
        Toster.error(data?.message || "Failed to update profile");
      }
    } catch (e) {
      Toster.error(e?.response?.data?.message || "failed to update profile");
    } finally {
      setField("image", false);
      backend.clearCache("/user/get-profile");
      setLoading(false);
    }
  };

  return {
    userProfile,
    fields,
    setField,
    isEditing,
    setIsEditing,
    saveProfile,
  };
}

function formatDate(dateString) {
  if (!dateString) return "Not provided";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Not provided";
  return date.toISOString().split("T")[0];
}
