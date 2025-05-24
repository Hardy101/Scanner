import { Link } from "react-router";

// Local Imports
import { CreateEventFormProps } from "../../constants/interfaces";
import { icons } from "../../constants/media";
import { profile } from "../../constants/media";

const TopNavigation: React.FC<CreateEventFormProps> = ({
  setIsCreateEventActive,
}) => {
  return (
    <div className="relative nav flex items-center justify-between text-sm py-4 border-b-2 border-gray-300">
      <div className="mobile-nav md:hidden">
        <button
          onClick={() => setIsCreateEventActive(true)}
          className="bs-2 rounded-md bg-white px-2 py-1 text-xl hover:bg-primary hover:text-white"
        >
          <i className="fa-solid fa-plus text-xl"></i>
        </button>

        <button className="bg-gray-1/20 fixed top-0 left-9/20 p-2 flex rounded-b-full">
          <Link
            to={"/scan"}
            className="flex text-white p-3 text-2xl bg-primary rounded-full"
          >
            <i className="fa-solid fa-camera"></i>
          </Link>
        </button>
        {/* Notifications button */}
        <button className="text-2xl">
          <i className="fa-regular fa-bell"></i>
        </button>
      </div>

      {/* Nav menu for lg screens */}
      <ul className="w-full hidden gap-6 items-center md:flex justify-between text-gray-1">
        <li>
          <Link to={"#"}>
            <img src={icons.logo} alt="logo of invix" className="w-16" />
          </Link>
        </li>
        <li className="text-black ml-8">
          <Link to={"/home"}>Home</Link>
        </li>
        <li className="text-black">
          <Link to={"#"}>Analytics</Link>
        </li>
        <li className="text-black">
          <Link to={"#"}>Help</Link>
        </li>
        <li className="ml-auto">
          <button
            onClick={() => setIsCreateEventActive(true)}
            className="grow border-b-4 border-primary text-black hover:text-white hover:bg-primary hover:border-none transition-all duration-300"
          >
            Create Event
          </button>
        </li>
        <li>
          <Link to={"#"} className="text-xl">
            <i className="fa-solid fa-gear"></i>
          </Link>
        </li>
        <li>
          <Link to={"#"} className="text-xl">
            <i className="fa-solid fa-bell"></i>
          </Link>
        </li>
        <li>
          <Link to={"/profile"} className="text-xl">
            <img
              src={profile}
              alt="Image of user"
              className="w-8 rounded-full"
            />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default TopNavigation;
