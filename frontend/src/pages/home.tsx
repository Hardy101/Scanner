import { Link, useNavigate } from "react-router";

import NavButton from "../components/navbutton";
import DropdownNav from "../components/dropdownnav";
import Hr from "../components/hr";

import { useDropdownState } from "../store/useDropdownStore";
import { useModalState } from "../store/useModalStore";
import Overlay from "../components/overlay";
import Modal from "../components/modal";
import { useState } from "react";

export interface formData {
  eventName: string;
  eventDate: string;
  eventVenue?: string;
  guests: number;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setIsDropdownActive } = useDropdownState();
  const { setIsModalActive } = useModalState();
  const [formData, setFormData] = useState<formData>({
    eventName: "",
    eventDate: "",
    guests: 0,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div className="relative min-h-screen bg-primary text-white p-4 md:p-8">
      {/* Floating Elements */}
      <Overlay />
      <DropdownNav />
      <button
        onClick={() => navigate("/scan")}
        className="absolute flex right-4 bottom-4 bg-white p-2 rounded-full box-shadow-1 text-primary text-2xl"
      >
        <i className="lni lni-camera-1"></i>
      </button>
      <Modal>
        <button
          onClick={() => {
            setIsModalActive(false),
              setFormData({ eventName: "", eventDate: "", guests: 0 });
          }}
          className="absolute flex bg-primary text-secondary rounded-md p-1 text-xl right-4 top-4 hover:bg-secondary-2"
        >
          <i className="lni lni-xmark"></i>
        </button>
        <div className="text-black text-xs">
          <h3 className="font-poppins-bold text-lg text-primary">
            Create Event
          </h3>
          <div className="form-control grid gap-2 mt-6">
            <label className="font-poppins-bold text-primary">
              Name of Event
            </label>
            <input
              type="text"
              name="eventName"
              id="eventName"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="Enter Name"
              className="w-full bg-secondary text-primary placeholder:text-primary px-2 py-2 text-xs rounded-sm"
            />
          </div>
          <div className="form-control grid gap-2 mt-4">
            <label className="font-poppins-bold text-primary">
              Date of Event
            </label>
            <input
              type="date"
              name="eventDate"
              id="eventDate"
              onChange={handleChange}
              value={formData.eventDate}
              placeholder="Select Date"
              className="w-full bg-secondary text-primary placeholder:text-primary px-2 py-2 text-xs rounded-sm"
            />
          </div>
          <div className="form-control grid gap-2 mt-4">
            <label className="font-poppins-bold text-primary">
              Expected Guests
            </label>
            <input
              type="number"
              name="guests"
              id="guests"
              onChange={handleChange}
              value={formData.guests}
              placeholder="Select number of guests"
              className="w-full bg-secondary text-primary placeholder:text-primary px-2 py-2 text-xs rounded-sm"
            />
          </div>
          <div className="form-control mt-8 flex gap-4">
            <button className="w-full box-shadow-1 bg-primary text-white font-poppins-bold px-6 py-2 rounded-full text-sm mx-auto">
              Create Event
            </button>
          </div>
        </div>
      </Modal>
      {/* End of floating Elements */}

      <div className="nav flex items-center justify-between text-sm">
        <p className="grid text-left">
          <span>Sunday, </span>
          <span>15th October 2025</span>
        </p>
        <NavButton text="Menu" onClick={() => setIsDropdownActive(true)} />
      </div>
      <Hr />
      <div className="body mt-10 ">
        <h2 className="text-2xl font-poppins-bold">Hi, Peter</h2>
        <p className="text-sm text-secondary">
          Welcome back, hope your doing well today?
        </p>

        <div id="events" className="mt-8 text-black grid gap-8">
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
