import { useNavigate } from "react-router";

import NavButton from "../components/navbutton";
import Hr from "../components/hr";
import { icons } from "../constants/media";

const EventDetails: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-primary text-white p-4 md:p-8">
      <button className="absolute right-4 bottom-4 bg-white p-2 rounded-full box-shadow-1">
        <img src={icons.edit} alt="Edit icon" className="w-6"/>
      </button>
      <div className="nav flex items-center justify-between text-sm">
        <p className="grid text-left">
          <span>Event Details</span>
        </p>
        <NavButton onClick={() => navigate(-1)} text="Back" classNames="" />
      </div>
      <Hr />

      <div className="body mt-10 ">
        <span className="border-l-4 text-lg pl-3 pr-4 py-1 text-white">
          Birthday Party
        </span>

        <ul className="mt-8 mb-8">
          <li className="text-secondary-2 flex items-center gap-2">
            <i className="lni lni-alarm-1"></i>
            <span>15th March 2025</span>
          </li>
          <li className="text-secondary-2 flex items-center gap-2">
            <i className="lni lni-location-arrow-right"></i>
            <span>15 Caramet Hill Off Jump Off bridge</span>
          </li>
        </ul>
        <Hr />
        <div id="guests" className="mt-10">
          <h3 className="font-poppins-bold">Guests</h3>
          <p className="text-sm text-secondary mt-2">50 Guests</p>

          <ul id="guests" className="mt-8 text-sm flex">
            <li>
              <button className="flex flex-col text-left bg-secondary-3 border border-shadow rounded-xl p-2">
                <span>David Aguero</span>
                <span className="text-secondary-2">VIP</span>
              </button>
            </li>
          </ul>
          <NavButton
            classNames="block mt-4 py-2 mx-auto"
            text="See all guests"
          />
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
