import { Link } from "react-router";

import { useDropdownState } from "../store/useDropdownStore";
import { useModalState } from "../store/useModalStore";
import LogoutButton from "../components/logOutbutton";

const LgNavbar = () => {
  const { setIsDropdownActive } = useDropdownState();
  const { setIsModalActive } = useModalState();

  return (
    <ul className="hidden gap-2 items-center md:flex text-secondary">
      <li>
        <Link to={"/profile"}>Profile</Link>
      </li>
      <li className="mr-10">
        <Link to={""}>Analytics</Link>
      </li>
      <li>
        <button
          onClick={() => {
            setIsModalActive(true), setIsDropdownActive(false);
          }}
          className="grow bg-shadow border border-shadow-2 rounded-full py-2 px-4 font-poppins-bold"
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
