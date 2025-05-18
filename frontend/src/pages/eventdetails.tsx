import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

import { useToastStore } from "../store/useToastStore";
import NavButton from "../components/navbutton";
import Hr from "../components/hr";
import { img } from "../constants/media";
import Modal from "../components/modal";
import { useModalState } from "../store/useModalStore";
import Overlay from "../components/overlay";
import { url } from "../constants/variables";
import { EventFormData, Guest } from "../constants/interfaces";
import ModalAction from "../components/eventDetails/modalActions";
import NavMenu from "../components/eventDetails/navMenu";

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFormActive, setIsFormActive] = useState(false); // Track if form is active to show/hide action buttons
  const [isFormChanged, SetisFormChanged] = useState(false); // Track if form is changed to enable the update button
  const [guest, setGuest] = useState<Guest>({
    name: "",
    tags: "",
    email: "",
    errors: "",
  });
  const [guestList, setGuestList] = useState([{ id: "", name: "", tags: "" }]);
  const { setIsModalActive } = useModalState();
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    date: "",
    location: "",
    expected_guests: 0,
  });

  const fetchEventDetails = async () => {
    try {
      const [eventRes, guestsRes] = await Promise.all([
        axios.get(`${url}/event/get-event/${id}`, { withCredentials: true }),
        axios.get(`${url}/event/guests/${id}`),
      ]);
      if (eventRes.status === 200) {
        const { name, date, location, expected_guests } = eventRes.data;
        setFormData({ name, date, location, expected_guests });
      }

      if (guestsRes.status === 200) {
        setGuestList(guestsRes.data);
      }
    } catch (err: any) {
      console.error(`Error: ${err}`);
    }
  };

  // Change function for events details
  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    SetisFormChanged(true);
    setFormData({ ...formData, [name]: value });
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await axios.delete(`${url}/event/delete/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        useToastStore.getState().setToastState({
          isToastActive: true,
          type: "success",
          text: "Event deleted successfully!",
          subtext: "Navigate to home to view all events",
        });
        navigate("/home");
      } else {
        console.error("Error deleting event:", response.data);
      }
    } catch (err: any) {
      console.error(`Error: ${err}`);
    }
  };

  const updateEventDetails = async () => {
    if (!isFormChanged) return;
    else {
      try {
        const response = await axios.put(
          `${url}/event/update/${id}`,
          formData,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setIsFormActive(false);
        } else {
          console.error("Error updating event:", response.data);
        }
      } catch (err: any) {
        console.error(`Error: ${err}`);
      }
    }
  };

  // Load Event Details on initial load
  useEffect(() => {
    fetchEventDetails();
  }, []);

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      {/* Floating Elements */}
      {/* Guest List */}
      <Modal>
        <button
          onClick={() => setIsModalActive(false)}
          className="absolute top-4 right-4 flex bg-primary text-secondary rounded-md text-3xl transition-all ease-in-out hover:bg-shadow"
        >
          <i className="lni lni-xmark"></i>
        </button>
        <ModalAction
          guest={guest}
          setGuest={setGuest}
          setFormData={setFormData}
        />
      </Modal>

      <Overlay />

      {/* End of Floating Elements */}
      <NavMenu />
      <Hr />

      <div className="body mt-4 pb-12">
        <div className="event-info rounded-xl overflow-clip">
          <img src={img.bd} alt="image of an event" className="w-full" />
        </div>
        <h1 className="py-4">
          <input
            readOnly={!isFormActive}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleEventFormChange}
            className={`w-full rounded-2xl text-xl font-poppins-bold outline-none ${
              isFormActive
                ? "border border-black rounded-2xl p-3"
                : "bg-transparent text-black"
            }`}
          />
          <span
            className={`block font-poppins text-gray-1 ${
              isFormActive ? "mt-2" : ""
            }`}
          >
            <input
              readOnly={!isFormActive}
              id="location"
              name="location"
              value={formData.location}
              onChange={handleEventFormChange}
              className={`w-full outline-none ${
                isFormActive
                  ? "border border-black rounded-2xl p-3"
                  : "bg-transparent text-black"
              }`}
            />
          </span>
        </h1>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2 items-center">
            <i className="lni lni-alarm-1"></i>
            <input
              readOnly={!isFormActive}
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleEventFormChange}
              className={`w-full p-2 outline-none ${
                isFormActive
                  ? "border rounded-2xl"
                  : "bg-transparent text-black"
              }`}
            />
          </div>

          <div className="flex gap-2 items-center">
            <i className="fa-solid fa-users"></i>
            <input
              readOnly={!isFormActive}
              type="text"
              id="expected_guests"
              name="expected_guests"
              value={formData.expected_guests}
              onChange={handleEventFormChange}
              className={`w-full p-2 outline-none ${
                isFormActive
                  ? "border rounded-2xl"
                  : "bg-transparent text-black"
              }`}
            />
          </div>

          <div className="col-span-2 flex gap-2 items-center">
            <i className="lni lni-location-arrow-right"></i>
            <span>12:00 PM</span>
          </div>
        </div>

        <Hr />
        <NavButton
          onClick={() => setIsModalActive(true)}
          classNames="w-full mt-4 py-2 ml-auto"
          text="See Guest List"
        />
        {/* Action buttons for editing event details */}
        {isFormActive && (
          <p
            id="formActions"
            className="animate__animated animate__fadeInUp grid grid-cols-2 md:flex justify-start gap-4 p-4 text-sm mt-8"
          >
            <button
              onClick={handleDeleteEvent}
              className="flex gap-2 items-center justify-center text-white bg-red p-2 rounded-md font-poppins-medium my-auto md:m-0"
            >
              Delete event
              <i className="fa-solid fa-trash"></i>
            </button>
            <button
              onClick={() => setIsFormActive(false)}
              className="flex gap-2 items-center justify-center bg-gray-1/30 p-2 rounded-md font-poppins-medium my-auto md:m-0"
            >
              Cancel changes
              <i className="fa-solid fa-xmark"></i>
            </button>
            <button
              onClick={updateEventDetails}
              className={`${
                !isFormChanged ? "bg-gray-1/30" : "bg-primary text-white"
              } col-span-2 flex gap-2 items-center justify-center py-2 rounded-md font-poppins-medium md:ml-auto`}
            >
              Update event
              <i className="fa-solid fa-pen-nib"></i>
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default EventDetails;

// setIsFormActive(true)}
