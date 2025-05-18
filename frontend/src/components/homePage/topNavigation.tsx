import { Link } from "react-router";
import { CreateEventFormProps } from "../../constants/interfaces";
import LgNavbar from "../lgNavbar";

const TopNavigation: React.FC<CreateEventFormProps> = ({
  setIsCreateEventActive,
}) => {
  return (
    <div className="relative nav flex items-center justify-between text-sm">
      <button
        onClick={() => setIsCreateEventActive(true)}
        className="md:hidden bs-2 rounded-xl bg-white p-3 hover:bg-primary hover:text-white"
      >
        <i className="fa-solid fa-plus text-xl"></i>
      </button>
      <button className="bg-gray-1/20 fixed top-0 left-1/2 p-2 flex rounded-b-full md:hidden">
        <Link
          to={"/scan"}
          className="flex text-white p-3 text-2xl bg-primary rounded-full"
        >
          <i className="fa-solid fa-camera"></i>
        </Link>
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

export default TopNavigation;
