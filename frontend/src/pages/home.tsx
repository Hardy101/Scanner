import { Link, useNavigate } from "react-router";

import DropdownNav from "../components/dropdownnav";

import { useDropdownState } from "../store/useDropdownStore";
import { useModalState } from "../store/useModalStore";
import Overlay from "../components/overlay";
import Modal from "../components/modal";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { url } from "../constants/variables";
import axios from "axios";
import { useEventStore } from "../store/useEventsStore";
import LoadingComponent from "../components/loading";
import { formatDate } from "../utils/functions";
import LgNavbar from "../components/lgNavbar";
import Navbar from "../components/navbar";

export interface formData {
  name: string;
  date: string;
  location: string;
  expected_guests: number;
}

const Home: React.FC = () => {
  // const { dayName, fullDate } = fancyDateToday(); // Get the current date and day name
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
  const [formError, setFormError] = useState<string | null>(null);
  const { events, isLoading, fetchEvents } = useEventStore();
  const eventFormField =
    "w-full bg-secondary text-primary placeholder:text-primary border border-shadow-2 p-4 text-sm rounded-2xl focus:outline-secondary-2";

  const refreshEvents = () => {
    fetchEvents();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/event/add`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response && response.status === 200) {
        setFormError("");
        const eventId = response.data.id;
        setFormData({
          name: "",
          date: "",
          location: "",
          expected_guests: 0,
        });
        setIsModalActive(false);
        // Redirect to the event details page after creating the event
        navigate(`/event/${eventId}`);
        refreshEvents();
      }
    } catch (err: any) {
      setFormError(
        "There's an error with your form, please fill it properly or try again"
      );
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
    <div className="relative min-h-dvh p-4 md:p-8">
      {/* Floating Elements */}
      <Navbar />
      <Overlay />
      <DropdownNav />
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
          <i className="fa-solid fa-xmark"></i>
        </button>
        <form onSubmit={handleSubmit} className="text-black text-xs">
          {formError && (
            <p className="font-poppins-medium text-base text-red my-2">
              {formError}
            </p>
          )}

          <h3 className="font-poppins-bold text-lg text-primary">
            Create Event
          </h3>
          <div className="form-control mt-6">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className={eventFormField}
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
              className={eventFormField}
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
              className={eventFormField}
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
              className={eventFormField}
            />
          </div>
          <div className="form-control mt-8 flex gap-4">
            <button className="w-full box-shadow-1 bg-primary text-white font-poppins-medium p-4 rounded-3xl text-sm mx-auto">
              Create Event
            </button>
          </div>
        </form>
      </Modal>
      {/* End of floating Elements */}
      <TopNavigation />

      <div className="body mt-10 ">
        {/* Upcoming events div */}
        <div className="w-3/5 grid gap-y-8 bg-green-1 px-4 py-8 rounded-3xl text-white">
          <p className="flex justify-between items-center">
            <span className="rounded-full text-3xl font-ibmplex-bold px-4 py-1 text-green-1 bg-white">
              1
            </span>
          </p>
          <span className="text-2xl font-ibmplex-bold">Upcoming events</span>
        </div>


        <h2 className="text-3xl font-ibmplex-bold">Events this month</h2>

        {isLoading ? (
          <LoadingComponent /> // Shows loading component while fetching data
        ) : (
          <ul
            id="events"
            className="mt-8 text-black grid md:grid-cols-3 items-start gap-8"
          >
            {events.map((event) => (
              <li key={event.id} className="relative bg-white rounded-xl p-4">
                {/* Floating elements */}
                <button id="linkout" className="absolute -bottom-2 -right-2">
                  <Link
                    to={`/event/${event.id}`}
                    className="flex bg-secondary-2 border-2 border-primary py-2 px-3 rounded-full text-white text-3xl"
                  >
                    <i className="fa-solid fa-arrow-up-long rotate-45"></i>
                  </Link>
                </button>
                <div className="absolute right-2 top-2 grid bg-red-2 px-4 py-2 rounded-full text-white text-center text-xs">
                  <span className="text-xl font-bold">
                    {formatDate(event.date).day}
                  </span>
                  <span>{formatDate(event.date).month}</span>
                </div>
                {/* End of floating elements */}
                <span className="inline-block max-w-4/5 border-l-4 border-black text-lg bg-secondary pl-3 pr-4 py-1 text-black my-auto">
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

// Navigation menu
const TopNavigation = () => {
  return (
    <div className="nav flex items-center justify-between text-sm">
      <button className="md:hidden bs-2 rounded-xl bg-white p-4">
        <i className="fa-solid fa-plus text-3xl"></i>
      </button>

      {/* Notifications button */}
      <button className="text-3xl md:hidden">
        <i className="fa-regular fa-bell"></i>
      </button>

      {/* Nav menu for lg screens */}
      <LgNavbar />
    </div>
  );
};
