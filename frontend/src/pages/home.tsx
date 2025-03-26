import { Link } from "react-router";

import NavButton from "../components/navbutton";
import DropdownNav from "../components/dropdownnav";
import Hr from "../components/hr";

import { useDropdownState } from "../store/useDropdownStore";
import Overlay from "../components/overlay";

const Home: React.FC = () => {
  const { setIsDropdownActive } = useDropdownState();

  return (
    <div className="relative min-h-screen bg-primary text-white p-4 md:p-8">
      {/* Floating Elements */}
      <Overlay />
      <DropdownNav />
      <button className="absolute flex right-4 bottom-4 bg-white p-2 rounded-full box-shadow-1 text-primary text-2xl">
        <i className="lni lni-camera-1"></i>
      </button>
      {/* End of floating Elements */}

      <div className="nav flex items-center justify-between text-sm">
        <p className="grid text-left">
          <span>Sunday, </span>
          <span>15th October 2025</span>
        </p>
        <NavButton
          text="Menu"
          onClick={() => setIsDropdownActive(true)}
          classNames=""
        />
      </div>
      <Hr />
      <div className="body mt-10 ">
        <h2 className="text-2xl font-poppins-bold">Hi, Peter</h2>
        <p className="text-sm text-secondary">
          Welcome back, hope your doing well today?
        </p>

        <div id="events" className="mt-8 text-black">
          <div className="relative bg-white rounded-xl p-4">
            <button id="linkout" className="absolute -bottom-2 -right-2">
              <Link
                to={"/event"}
                className="flex bg-secondary-2 border-2 border-primary p-1 rounded-full text-white text-3xl"
              >
                <i className="lni lni-arrow-angular-top-right"></i>
              </Link>
            </button>
            <button className="absolute right-2 top-2 grid bg-red-2 px-4 py-2 rounded-full text-white text-xs">
              <span className="text-xl font-bold">15</span>
              <span>Mar</span>
            </button>
            <span className="border-l-4 border-black text-lg bg-secondary pl-3 pr-4 py-1 text-black">
              Birthday Party
            </span>
            <ul className="text-xs text-gray-1 mt-5">
              <li className="grid">
                <span>50 Guests</span>
                <span>51, One Corner Street off Petepe Road</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
