import { Link, useNavigate } from "react-router";

import NavButton from "../components/navbutton";
import DropdownNav from "../components/dropdownnav";
import Hr from "../components/hr";

import { useDropdownState } from "../store/useDropdownStore";
import { useModalState } from "../store/useModalStore";
import Overlay from "../components/overlay";
import Modal from "../components/modal";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { url } from "./register";
import axios from "axios";
import { useEventStore } from "../store/useEventsStore";
import LoadingComponent from "../components/loading";
import { formatDate } from "../utils/functions";
import LogoutButton from "../components/logOutbutton";

export interface formData {
  name: string;
  date: string;
  location: string;
  expected_guests: number;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setIsDropdownActive } = useDropdownState();
  const { setIsModalActive } = useModalState();
  const [formData, setFormData] = useState<formData>({
    name: "",
    date: "",
    location: "",
    expected_guests: 0,
  });
  const { events, isLoading, fetchEvents } = useEventStore();

  const refreshEvents = () => {
    fetchEvents();
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      axios.post(`${url}/event/add-event`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setFormData({
        name: "",
        date: "",
        location: "",
        expected_guests: 0,
      });
      refreshEvents();
    } catch (err: any) {
      if (err.response) {
        console.error(`Error: ${err.response.data}`);
      } else {
        console.error(`Error: ${err.message}`);
      }
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    refreshEvents();
  }, [fetchEvents]);

  return (
    <div className="relative min-h-screen bg-primary text-white p-4 md:p-8">
      {/* Floating Elements */}
      <Overlay />
      <DropdownNav />
      <button
        onClick={() => navigate("/scan")}
        className="absolute flex right-4 bottom-4 bg-white p-4 rounded-full box-shadow-1 text-primary text-2xl"
      >
        {/* <i className="lni lni-camera-1"></i> */}
        <i className="fa-solid fa-camera"></i>
      </button>
      <Modal>
        <button
          onClick={() => {
            setIsModalActive(false),
              setFormData({
                name: "",
                date: "",
                location: "",
                expected_guests: 0,
              });
          }}
          className="absolute flex bg-primary text-secondary rounded-md p-1 text-xl right-4 top-4 hover:bg-secondary-2"
        >
          {/* <i className="lni lni-xmark"></i> */}
          <i className="fa-solid fa-xmark"></i>
        </button>
        <form onSubmit={handleSubmit} className="text-black text-xs">
          <h3 className="font-poppins-bold text-lg text-primary">
            Create Event
          </h3>
          <div className="form-control grid gap-2 mt-6">
            <label htmlFor="name" className="font-poppins-bold text-primary">
              Name of Event
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className="w-full bg-secondary text-primary placeholder:text-primary px-2 py-2 text-xs rounded-sm"
            />
          </div>
          <div className="form-control grid gap-2 mt-4">
            <label htmlFor="date" className="font-poppins-bold text-primary">
              Date of Event
            </label>
            <input
              type="date"
              name="date"
              id="date"
              onChange={handleChange}
              value={formData.date}
              placeholder="Select Date"
              className="w-full bg-secondary text-primary placeholder:text-primary px-2 py-2 text-xs rounded-sm"
            />
          </div>
          <div className="form-control grid gap-2 mt-4">
            <label
              htmlFor="location"
              className="font-poppins-bold text-primary"
            >
              Venue
            </label>
            <input
              type="text"
              name="location"
              id="location"
              onChange={handleChange}
              value={formData.location}
              placeholder="Select Venue"
              className="w-full bg-secondary text-primary placeholder:text-primary px-2 py-2 text-xs rounded-sm"
            />
          </div>
          <div className="form-control grid gap-2 mt-4">
            <label htmlFor="guests" className="font-poppins-bold text-primary">
              Expected Guests
            </label>
            <input
              type="number"
              name="expected_guests"
              id="expected_guests"
              min={1}
              onChange={handleChange}
              value={formData.expected_guests}
              placeholder="Select number of guests"
              className="w-full bg-secondary text-primary placeholder:text-primary px-2 py-2 text-xs rounded-sm"
            />
          </div>
          <div className="form-control mt-8 flex gap-4">
            <button className="w-full box-shadow-1 bg-primary text-white font-poppins-bold px-6 py-2 rounded-full text-sm mx-auto">
              Create Event
            </button>
          </div>
        </form>
      </Modal>
      {/* End of floating Elements */}

      <div className="nav flex items-center justify-between text-sm">
        <p className="grid text-left">
          <span>Sunday, </span>
          <span>15th October 2025</span>
        </p>
        <ul className="hidden gap-2 items-center md:flex text-secondary">
          <li>
            <Link to={"/profile"}>Profile</Link>
          </li>
          <li className="mr-10">
            <Link to={""}>Analytics</Link>
          </li>
          <li>
            <LogoutButton/>
          </li>
        </ul>
        <NavButton
          text="Menu"
          onClick={() => setIsDropdownActive(true)}
          classNames="md:hidden"
        />
      </div>
      <Hr />
      <div className="body mt-10 ">
        <h2 className="text-2xl font-poppins-bold">Hi, {user?.name}</h2>

        <p className="text-sm text-secondary">
          Welcome back, hope your doing well today?
        </p>

        {isLoading ? (
          <LoadingComponent />
        ) : (
          <ul id="events" className="mt-8 text-black grid md:grid-cols-3 gap-8">
            {events.map((event) => (
              <li key={event.id} className="relative bg-white rounded-xl p-4">
                <button id="linkout" className="absolute -bottom-2 -right-2">
                  <Link
                    to={`/event/${event.id}`}
                    className="flex bg-secondary-2 border-2 border-primary py-2 px-3 rounded-full text-white text-3xl"
                  >
                    {/* <i className="lni lni-arrow-angular-top-right"></i> */}
                    <i className="fa-solid fa-arrow-up-long rotate-45"></i>
                  </Link>
                </button>
                <div className="absolute right-2 top-2 grid bg-red-2 px-4 py-2 rounded-full text-white text-center text-xs">
                  <span className="text-xl font-bold">
                    {formatDate(event.date).day}
                  </span>
                  <span>{formatDate(event.date).month}</span>
                </div>
                <span className="border-l-4 border-black text-lg bg-secondary pl-3 pr-4 py-1 text-black">
                  {event.name}
                </span>
                <ul className="text-xs text-gray-1 mt-5">
                  <li className="grid">
                    <span>{event.expected_guests} Guests</span>
                    <span>{event.location}</span>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
