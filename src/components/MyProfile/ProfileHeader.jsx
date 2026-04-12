import { Camera, User } from "lucide-react";
import LogoutButton from "../../components/MyProfile/LogoutButton.jsx";

export default function ProfileHeader({
  userProfile,
  isEditing,
  name,
  image,
  setName,
  setImage,
  onEdit,
  onSave,
}) {
  return (
    <div className="bg-[#1a4122] px-4 lg:px-8 py-4 lg:py-6 m-2 lg:mx-4 rounded-xl lg:rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            {isEditing ? (
              <label htmlFor="image" className="relative cursor-pointer block">
                <img
                  className="w-15 h-15 rounded-full object-cover opacity-25"
                  src={image ? URL.createObjectURL(image) : userProfile?.image}
                  alt="Profile"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Camera className="w-7 h-7 text-green-700 opacity-80" />
                </div>
                <input
                  type="file"
                  id="image"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImage(file);
                  }}
                />
              </label>
            ) : userProfile?.image ? (
              <img
                className="w-11 h-11 lg:h-15 lg:w-15 object-cover rounded-full"
                src={userProfile?.image}
                alt="Profile"
              />
            ) : (
              <div className="w-36 h-36 rounded bg-white bg-opacity-20 flex items-center justify-center">
                <User className="w-10 h-10 text-white opacity-70" />
              </div>
            )}
          </div>

          <div className="ml-4">
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-md sm:text-xl md:text-2xl text-white px-2 py-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-300"
                placeholder="Your name"
              />
            ) : (
              <h4 className="text-md sm:text-xl md:text-2xl  text-white">
                {userProfile?.name || "User"}
              </h4>
            )}
            <p className="text-xs sm:text-sm lg:text-base text-blue-100">
              Account Information
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={isEditing ? onSave : onEdit}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors px-2 md:px-4 py-2 rounded-lg text-gray-800 flex items-center justify-center text-xs md:text-sm lg:text-base cursor-pointer"
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>

          <div className="block">
            <LogoutButton className=" hover:bg-gray-900 cursor-pointer text-xs rounded-lg bg-white text-gray-800 md:text-sm lg:text-base hover:text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
