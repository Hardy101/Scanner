import { Link, useNavigate } from "react-router";

import DropdownNav from "../components/dropdownnav";

// import { useDropdownState } from "../store/useDropdownStore";
import { useModalState } from "../store/useModalStore";
import Overlay from "../components/overlay";
import Modal from "../components/modal";
import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthProvider";
import { url } from "../constants/variables";
import { img } from "../constants/media";
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
  // const { user } = useAuth();
  const { events, isLoading, fetchEvents } = useEventStore();
  const { setIsModalActive } = useModalState();

  const refreshEvents = () => {
    fetchEvents();
  };

  useEffect(() => {
    refreshEvents();
  }, [fetchEvents]);

  return (
    <div className="relative min-h-dvh p-4 md:p-8">
      {/* Floating Elements */}
      <CreateEventForm />
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
        <CreateEventForm />
      </Modal>
      {/* End of floating Elements */}
      <TopNavigation />

      <div className="body mt-10 ">
        {/* Upcoming events div */}
        <div className="w-fit flex flex-col gap-y-8 bg-primary px-4 py-8 rounded-3xl text-white">
          <span className="w-fit px-2 rounded-full text-3xl font-ibmplex-bold text-primary bg-white">
            {events.length}
          </span>
          <span className="text-2xl font-ibmplex-bold">Upcoming events</span>
        </div>

        <h2 className="text-3xl font-ibmplex-bold mt-8">Events this month</h2>

        {isLoading ? (
          <LoadingComponent /> // Shows loading component while fetching data
        ) : (
          <EventList />
        )}
      </div>
    </div>
  );
};

export default Home;

// Navigation menu
const TopNavigation = () => {
  const { setIsModalActive } = useModalState();
  return (
    <div className="nav flex items-center justify-between text-sm">
      <button
        onClick={() => setIsModalActive(true)}
        className="md:hidden bs-2 rounded-xl bg-white p-3"
      >
        <i className="fa-solid fa-plus text-2xl"></i>
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

const EventList = () => {
  const { events } = useEventStore();
  return (
    <ul
      id="events"
      className="mt-8 text-black grid md:grid-cols-4 items-start gap-8"
    >
      {events.map((event) => (
        <li
          key={event.id}
          className="relative aspect-[1/1] flex flex-col rounded-3xl p-3 font-dmserif"
        >
          <button id="linkout" className="absolute -bottom-2 -right-2 z-3">
            <Link
              to={`/event/${event.id}`}
              className="flex bg-primary border-2 py-2 px-3 rounded-full text-white text-4xl"
            >
              <i className="fa-solid fa-arrow-up-long rotate-45"></i>
            </Link>
          </button>
          <img
            src={img.bd}
            alt="image of a birthday"
            className="absolute top-0 left-0 w-full h-full rounded-3xl z-1"
          />
          <div className="overlay bg-black/30 absolute top-0 left-0 w-full h-full rounded-3xl z-2"></div>
          <div className="txt mt-auto z-4">
            <h3 className="text-2xl text-white">{event.name}</h3>
            <p className="w-fit bg-white rounded-full px-4 py-1">
              {formatDate(event.date).month} {formatDate(event.date).day}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

const CreateEventForm: React.FC = () => {
  const { fetchEvents } = useEventStore();
  const [formData, setFormData] = useState<formData>({
    name: "",
    date: "",
    location: "",
    expected_guests: 0,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const { setIsModalActive } = useModalState();

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
  return (
    <div className="fixed w-full h-full top-0 translate-y-full left-0 bg-white font-ibmplex p-4 overflow-y-auto z-20">
      <form className="grid gap-y-8" onSubmit={handleSubmit}>
        <div className="form-control flex items-center gap-8">
          <button
            type="button"
            className="p-4 flex items-center rounded-full bs-2 text-xl"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2 className="text-3xl font-dmserif">Create Event</h2>
        </div>

        {/* Upload Form field */}
        <div className="form-control grid gap-y-3">
          <span className="text-2xl font-dmserif">
            Upload file{" "}
            <span className="text-base font-ibmplex">(optional)</span>
          </span>
          <label
            htmlFor="file"
            className="flex flex-col gap-2 items-center py-4 border-2 border-black border-dashed rounded-md"
          >
            <i className="fa-solid fa-image text-5xl text-primary"></i>
            <span>Drag or drop files to upload</span>
            <button className="px-4 py-2 rounded-md border font-ibmplex-bold text-primary">
              Select files
            </button>
          </label>
          <input type="file" name="file" id="file" hidden />
        </div>
        {/* End of Upload Form field */}
        {/* Name of Event form field */}
        <div className="form-control grid gap-y-3">
          <label htmlFor="name" className="font-ibmplex-bold text-2xl">
            Name of Event
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="px-2 py-4 border border-black rounded-md"
            placeholder="Min Char 4."
          />
        </div>
        {/* Name of Event form field */}
        {/* Date and time event form field*/}
        <div className="form-control grid grid-cols-2 gap-y-3 gap-x-8">
          <label
            htmlFor="date"
            className="text-2xl col-span-2 font-ibmplex-bold grid grid-cols-2"
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            className="px-2 py-4 border border-black rounded-md font-ibmplex-bold"
          />
          <input
            type="time"
            name="time"
            id="time"
            className="px-2 py-4 border border-black rounded-md font-ibmplex-bold"
          />
        </div>
        {/* End of Date and time event form field */}

        {/* Location of Event form field */}
        <div className="form-control grid gap-y-3">
          <label htmlFor="location" className="font-ibmplex-bold text-2xl">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="px-2 py-4 border border-black rounded-md"
            placeholder="Min Char 4."
          />
        </div>
        {/* Location of Event form field */}

        {/* Name of Event form field */}
        <div className="form-control grid gap-y-3">
          <label
            htmlFor="expected_guests"
            className="font-ibmplex-bold text-2xl"
          >
            Expected number of guests
          </label>
          <input
            type="number"
            name="expected_guests"
            id="expected_guests"
            value={formData.name}
            onChange={handleChange}
            className="px-2 py-4 border border-black rounded-md"
            min={1}
            placeholder="Min 1."
          />
        </div>
        {/* Name of Event form field */}
        {/* Upload Form field */}
        <div className="form-control grid gap-y-3">
          <div className="label">
            <span className="text-2xl font-dmserif">
              Guest list{" "}
              <span className="text-base font-ibmplex">(optional)</span>
            </span>
            <p className="italic">
              see{" "}
              <span className="text-primary font-ibmplex-bold">
                how to upload{" "}
              </span>
              guest list
            </p>
          </div>
          <label
            htmlFor="img"
            className="flex flex-col gap-2 items-center py-4 border-2 border-black border-dashed rounded-md"
          >
            <i className="fa-solid fa-file-excel text-5xl text-primary"></i>
            <span>Drag or drop files to upload</span>
            <button className="px-4 py-2 rounded-md border font-ibmplex-bold text-primary">
              Select files
            </button>
          </label>
          <input type="file" name="img" id="img" hidden />
        </div>
        {/* End of Upload Form field */}
        {/* Highlights Form field */}
        <div className="form-control grid gap-y-3">
          <label
            htmlFor="h-time"
            className="flex items-baseline gap-2 font-ibmplex-bold text-2xl"
          >
            Highlights
            <span className="text-base font-ibmplex">(optional)</span>
          </label>
          <div className="input grid grid-cols-2 gap-4">
            <input
              type="text"
              name="activity"
              id="activity"
              placeholder="activity"
              className="px-2 py-4 border border-black rounded-md"
            />
            <input
              type="number"
              name="h-time"
              id="h-time"
              className="px-2 py-4 border border-black rounded-md"
            />
          </div>
        </div>
        {/* End of Highlights Form field */}
        <div className="form-control grid gap-y-3">
          <button className="px-2 py-4 bg-primary font-ibmplex-bold text-xl text-white rounded-md">
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};
