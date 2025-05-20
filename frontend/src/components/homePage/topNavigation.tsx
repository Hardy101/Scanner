import { Link } from "react-router";

// Local Imports
import { CreateEventFormProps } from "../../constants/interfaces";
import { icons } from "../../constants/media";
import LogoutButton from "../logOutbutton";

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
      <button className="bg-gray-1/20 fixed top-0 left-9/20 p-2 flex rounded-b-full md:hidden">
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
      <ul className="w-full hidden gap-6 items-center md:flex justify-between text-black font-poppins-medium">
        <li>
          <Link to={"#"}>
            <img src={icons.logo} alt="logo of invix" className="w-16" />
          </Link>
        </li>
        <li className="ml-auto">
          <Link to={"/home"}>Home</Link>
        </li>
        <li>
          <Link to={"#"}>Analytics</Link>
        </li>
        <li>
          <Link to={"/profile"}>Profile</Link>
        </li>
        <li>
          <Link to={""}>Settings</Link>
        </li>
        <li className="ml-auto">
          <button
            onClick={() => setIsCreateEventActive(true)}
            className="grow bg-primary border rounded-full py-2 px-4 text-white"
          >
            Add Event
          </button>
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </div>
  );
};

export default TopNavigation;
