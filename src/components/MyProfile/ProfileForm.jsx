export default function ProfileForm({
  name,
  contactNumber,
  birthdate,
  gender,
  isBirthdateEdited,
  isGenderEdited,
  setField,
  onSave,
  onCancel,
}) {
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  return (
    <div className="space-y-2 pb-4">
      <div className="p-2 bg-gray-50 rounded-xl w-full">
        <label
          htmlFor="name"
          className="block text-xs lg:text-sm text-gray-500 font-medium mb-2"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setField("name", e.target.value)}
          className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base"
        />
      </div>

      <div className="p-2 bg-gray-50 rounded-xl w-full">
        <label
          htmlFor="contactNumber"
          className="block text-xs lg:text-sm text-gray-500 font-medium mb-2"
        >
          Contact Number
        </label>
        <input
          id="contactNumber"
          type="text"
          maxLength={10}
          value={contactNumber}
          onChange={(e) => setField("contactNumber", e.target.value)}
          className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base"
        />
      </div>

      <div className="p-2 bg-gray-50 rounded-xl w-full">
        <label
          htmlFor="birthdate"
          className="block text-xs lg:text-sm text-gray-500 font-medium mb-2"
        >
          Birthdate
        </label>
        <input
          id="birthdate"
          type="date"
          disabled={!!birthdate}
          value={formatDateForInput(birthdate)}
          onChange={(e) => setField("birthdate", e.target.value)}
          className={`w-full ${
            birthdate && "text-gray-500"
          } px-3 lg:px-4 py-2 lg:py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base`}
        />
      </div>

      <div className="p-2 bg-gray-50 rounded-xl w-full">
        <label className="block text-xs lg:text-sm text-gray-500 font-medium mb-2">
          Gender
        </label>
        <div className="flex gap-4 flex-wrap">
          {["Male", "Female", "Other"].map((g) => (
            <label key={g} className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value={g}
                disabled={!!gender}
                checked={gender === g}
                onChange={(e) => setField("gender", e.target.value)}
                className="text-green-600 focus:ring-green-500"
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 mx-2 lg:mx-0">
        <button
          onClick={onSave}
          className="px-6 py-2 cursor-pointer bg-linear-to-r from-green-500 to-green-700 text-white rounded-lg hover:shadow-lg transition-shadow text-sm lg:text-base"
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 cursor-pointer bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm lg:text-base"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
