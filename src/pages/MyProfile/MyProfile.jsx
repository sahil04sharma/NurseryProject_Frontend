import useProfile from "../../hooks/useProfile";
import ProfileHeader from "../../components/MyProfile/ProfileHeader";
import ProfileForm from "../../components/MyProfile/ProfileForm";
import ProfileView from "../../components/MyProfile/ProfileView";
import PageLoader from "../../components/Loader/PageLoader";
import { convertSingleToWebP } from "../../helper/convertToWebP";
import { useAuth } from "../../ContextApi/AuthContext";

export default function MyProfile() {
  const {
    userProfile,
    fields,
    setField,
    isEditing,
    setIsEditing,
    saveProfile,
  } = useProfile();
  const {loading} = useAuth();

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-4xl lg:p-6 lg:pt-8 lg:pr-8 mx-auto">
      <div className="bg-white shadow-xl rounded-2xl lg:rounded-3xl overflow-hidden mb-2 lg:mx-0">
        <ProfileHeader
          userProfile={userProfile}
          isEditing={isEditing}
          name={fields.name}
          image={fields.image}
          setName={(v) => setField("name", v)}
          setImage={async (f) => {
            const compressed = await convertSingleToWebP(f);
            setField("image", compressed);
          }}
          onEdit={() => setIsEditing(true)}
          onSave={saveProfile}
        />

        <div className="lg:p-4 mx-2 lg:mx-4">
          <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
            Personal Information
          </h3>
          {isEditing ? (
            <ProfileForm
              name={fields.name}
              contactNumber={fields.contactNumber}
              birthdate={fields.birthdate}
              gender={fields.gender}
              isBirthdateEdited={fields.isBirthdateEdited}
              isGenderEdited={fields.isGenderEdited}
              setField={setField}
              onSave={saveProfile}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileView userProfile={userProfile} />
          )}
        </div>
      </div>
    </div>
  );
}
