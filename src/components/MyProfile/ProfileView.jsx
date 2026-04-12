// src/pages/MyProfile/components/ProfileView.jsx
import { User, Mail, Phone, Calendar, UserCircle } from "lucide-react";

export default function ProfileView({ userProfile }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Not provided";
    return date.toISOString().split("T")[0];
  };

  const profileData = [
    { label: "Full Name", value: userProfile?.name || "N/A", icon: User },
    { label: "Email Address", value: userProfile?.email || "N/A", icon: Mail },
    { label: "Contact Number", value: userProfile?.contact || "N/A", icon: Phone },
    { label: "BirthDate", value: formatDate(userProfile?.dob) || "N/A", icon: Calendar },
    { label: "Gender", value: userProfile?.gender || "N/A", icon: UserCircle },
  ];

  return (
    <div className="space-y-2 pb-4">
      {profileData.map((item, index) => (
        <div
          key={index}
          className="flex items-center p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors lg:mx-0"
        >
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#1a4122] rounded-lg flex items-center justify-center shrink-0">
            <item.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <div className="ml-3 lg:ml-4 flex-1 min-w-0">
            <p className="text-xs lg:text-sm text-gray-500 font-medium">{item.label}</p>
            <p className="text-sm lg:text-base text-gray-700 font-semibold truncate">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
