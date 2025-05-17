import { CreateEventFormProps } from "../../constants/interfaces";
import LgNavbar from "../lgNavbar";

const TopNavigation: React.FC<CreateEventFormProps> = ({
  setIsCreateEventActive,
}) => {
  return (
    <div className="nav flex items-center justify-between text-sm">
      <button
        onClick={() => setIsCreateEventActive(true)}
        className="md:hidden bs-2 rounded-xl bg-white p-3"
      >
        <i className="fa-solid fa-plus text-xl"></i>
      </button>

      {/* Notifications button */}
      <button className="text-2xl md:hidden">
        <i className="fa-regular fa-bell"></i>
      </button>

      {/* Nav menu for lg screens */}
      <LgNavbar />
    </div>
  );
};

export default TopNavigation