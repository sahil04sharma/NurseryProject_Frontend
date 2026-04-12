import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccountButton() {
  const navigate = useNavigate();

  return (
    <button
      className="p-1.5 text-gray-600 hover:text-[#0A6041] transition-colors"
      aria-label="Account"
      onClick={() => navigate("/my-profile")}
    >
      <User size={20} />
    </button>
  );
}
