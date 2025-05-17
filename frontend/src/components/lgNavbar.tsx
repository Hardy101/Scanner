import { Link } from "react-router";

import { useDropdownState } from "../store/useDropdownStore";
import { useModalState } from "../store/useModalStore";
import LogoutButton from "../components/logOutbutton";
import { icons } from "../constants/media";

const LgNavbar = () => {
  const { setIsDropdownActive } = useDropdownState();
  const { setIsModalActive } = useModalState();

  return (
    <ul className="w-full hidden gap-6 items-center md:flex justify-between text-black font-ibmplex-bold">
      <li>
        <Link to={"#"}>
          <img src={icons.logo} alt="logo of invix" className="w-16"/>
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
          onClick={() => {
            setIsModalActive(true), setIsDropdownActive(false);
          }}
          className="grow bg-shadow border border-shadow-2 rounded-full py-2 px-4 text-white"
        >
          Add Event
        </button>
      </li>
      <li>
        <LogoutButton />
      </li>
    </ul>
  );
};

export default LgNavbar;
