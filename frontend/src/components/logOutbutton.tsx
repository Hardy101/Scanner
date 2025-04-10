import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEventStore } from "../store/useEventsStore";

const LogoutButton = () => {
  const { logout } = useAuth();
  const { clearEvents } = useEventStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();

    if (success) {
      clearEvents()
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
