import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();

    if (success) {
      navigate("/");
    } else {
      console.error("Logout failed. Not navigating.");
    }
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
