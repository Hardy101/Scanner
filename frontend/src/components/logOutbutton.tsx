import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("");
  };

  return (
    <button
      className="flex items-center gap-2 bg-red text-white rounded-full py-2 px-4"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
