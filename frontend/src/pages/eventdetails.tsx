import { useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useToastStore } from "../store/useToastStore";

import NavButton from "../components/navbutton";
import ActionButton from "../components/actionbutton";
import Hr from "../components/hr";
import { icons } from "../constants/media";
import Modal from "../components/modal";
import { useModalState } from "../store/useModalStore";
import Overlay from "../components/overlay";
import { formData } from "./home";
import { url } from "../constants/variables";
import { Guest, GuestResponse } from "../constants/interfaces";
import { copyToClipboard } from "../utils/functions";

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const textRef = useRef<HTMLAnchorElement | null>(null);
  const navigate = useNavigate();

  const [isFormActive, setIsFormActive] = useState(false); // Track if form is active to show/hide action buttons
  const [isFormChanged, SetisFormChanged] = useState(false); // Track if form is changed to enable the update button
  const [singleGuest, setSingleGuest] = useState(true); // Track if single guest is selected
  const [guestDetails, setGuestDetails] = useState<GuestResponse>({
    id: 0,
    name: "",
    tags: "",
    qr_token: "",
  }); // Track if guest details are shown
  const [guest, setGuest] = useState<Guest>({
    name: "",
    tags: "",
    email: "",
    errors: "",
  });
  const [guestList, setGuestList] = useState([{ id: "", name: "", tags: "" }]);
  const { setIsModalActive } = useModalState();
  const [activeStep, setActiveStep] = useState("guestList");
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<formData>({
    name: "",
    date: "",
    location: "",
    expected_guests: 0,
  });
  const formFieldClass =
    "border border-gray-400 text-primary placeholder:text-primary p-3 text-sm rounded-xl focus:border-primary focus:outline-none";
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

  // Change function for guest details
  const handleGuestFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuest({ ...guest, [name]: value });
  };

  const handleGuestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/event/add-guest/${id}`, guest, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setGuestDetails(response.data);
        setActiveStep("success");
        fetchEventDetails();
        useToastStore.getState().setToastState({
          isToastActive: true,
          type: "success",
          text: "Guest added successfully!",
          subtext: "Navigate to guest list to view all guests",
        });
      } else {
        console.error("Error adding guest:", response.data);
      }
    } catch (err: any) {
      if (err.response) {
        console.error(`Error: ${JSON.stringify(err.response.data)}`);
        setGuest((prev) => ({
          ...prev,
          errors: err.response.data.detail,
        }));
      } else {
        console.error(`Error: ${err.message}`);
      }
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    try {
      const response = await axios.delete(
        `${url}/event/delete-guest/${guestId}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        useToastStore.getState().setToastState({
          isToastActive: true,
          type: "success",
          text: "Guest deleted successfully!",
          subtext:
            "The selected guest has been successfully deleted from the system.",
        });
        fetchEventDetails();
      } else {
        console.error("Error deleting guest:", response.data);
      }
    } catch (err: any) {
      console.error(`Error: ${err}`);
    }
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${url}/event/guests-bulk/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        fetchEventDetails();
        setActiveStep("success");
      }
      console.log(response.status);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // Load Event Details on initial load
  useEffect(() => {
    fetchEventDetails();
  }, []);

  return (
    <div className="relative min-h-screen bg-primary text-white p-4 md:p-8">
      {/* Floating Elements */}
      {/* Guest List */}
      <Modal>
        <button
          onClick={() => setIsModalActive(false)}
          className="absolute top-4 right-4 flex bg-primary text-secondary rounded-md text-3xl transition-all ease-in-out hover:bg-shadow"
        >
          <i className="lni lni-xmark"></i>
        </button>
        {activeStep == "guestList" && (
          <div className="text-black">
            <h3 className="font-poppins-bold text-xl">Guest List</h3>
            <ul className="grid gap-2 divide-y divide-secondary-2 mt-6 text-xs max-h-72 overflow-y-auto">
              {guestList.map(({ id, name, tags }) => (
                <li
                  // onClick={() => setActiveStep("guestDetails")}
                  key={id}
                  className="grid grid-cols-2 flex-col pb-2 cursor-pointer hover:bg-secondary"
                >
                  <span>{name}</span>

                  <button
                    onClick={() => handleDeleteGuest(id)}
                    className="flex items-center gap-2 ml-auto bg-red text-right text-white px-2 py-1 rounded-sm hover:bg-red-2"
                  >
                    <span>Delete</span>
                    {/* <i className="fa-solid fa-trash"></i> */}
                  </button>
                  <span className="col-span-2 font-poppins-bold text-primary">
                    {tags}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 justify-between mt-8">
              <ActionButton
                onClick={() => setActiveStep("addGuest")}
                icon="fa-solid fa-paper-plane"
                text="Send invitations"
                classNames="bg-primary text-white rounded-full"
              />
              <ActionButton
                onClick={() => setActiveStep("addGuest")}
                icon="fa-solid fa-user-plus"
                text="Add Guest"
                classNames="bg-primary text-white rounded-full"
              />
            </div>
          </div>
        )}

        {activeStep == "guestDetails" && (
          <div className="text-black grid grid-cols-2">
            <div className="grid">
              <h3 className="font-poppins-bold text-lg">Scarlett Johansson</h3>
              <p className="inline-flex items-center justify-between gap-2 mx-auto text-xs">
                <span className="text-gray-1 underline">
                  {`${url}/event/qrcode/${guestDetails.qr_token}`}
                </span>
                <button
                  onClick={() => {
                    copyToClipboard(textRef.current).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    });
                  }}
                  className="bg-primary text-white rounded-md px-2 py-1"
                >
                  {copied ? "copied!" : "copy"}
                </button>
              </p>
            </div>

            <img
              src={icons.qrcode}
              alt="Image of a qr code scan"
              className="w-1/2 ml-auto"
            />

            <div className="col-span-2 flex gap-8 items-center justify-between">
              <ActionButton
                onClick={() => setActiveStep("addGuest")}
                text="Edit"
                classNames="grow bg-primary text-white rounded-full"
              />
              <ActionButton
                onClick={() => setActiveStep("addGuest")}
                text="Delete"
                classNames="bg-white text-primary rounded-full border-2 border-primary"
              />
            </div>
          </div>
        )}

        {activeStep == "addGuest" && (
          <div className="text-black">
            <h3 className="font-poppins-bold text-xl">Add guest to list</h3>
            <p className="relative md:w-1/3 mx-auto grid grid-cols-2 text-sm font-poppins-medium text-primary text-center bg-secondary rounded-2xl p-1 mt-2">
              <span
                className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] bg-white rounded-2xl transition-transform duration-300 ease-in-out z-0 ${
                  singleGuest ? "translate-x-0" : "translate-x-full"
                }`}
              ></span>
              <button
                onClick={() => setSingleGuest(true)}
                type="button"
                className="py-2 z-10"
              >
                Single Guest
              </button>
              <button
                onClick={() => setSingleGuest(false)}
                type="button"
                className="py-2 z-10"
              >
                Multiple Guests
              </button>
            </p>
            {singleGuest && (
              <form onSubmit={handleGuestSubmit}>
                <div className="form-control grid gap-2 my-4">
                  <p className="text-red font-poppins-bold">{guest.errors}</p>
                </div>
                <div className="form-control grid gap-2">
                  <input
                    type="text"
                    name="name"
                    value={guest.name}
                    onChange={handleGuestFormChange}
                    placeholder="Enter guest name"
                    className={formFieldClass}
                    required
                  />
                </div>
                <div className="form-control grid gap-2 mt-4">
                  <input
                    type="text"
                    name="tags"
                    value={guest.tags}
                    onChange={handleGuestFormChange}
                    placeholder="Enter tags"
                    className={formFieldClass}
                    required
                  />
                </div>
                <div className="form-control grid gap-2 mt-4">
                  <input
                    type="email"
                    name="email"
                    value={guest.email}
                    onChange={handleGuestFormChange}
                    placeholder="Enter guest email"
                    className={formFieldClass}
                    required
                  />
                </div>

                <div className="form-control flex gap-4 mt-4">
                  <ActionButton
                    text="Add Guest"
                    icon="fa-solid fa-user-plus"
                    classNames="w-full bg-primary text-white rounded-full"
                  />
                  <ActionButton
                    type="button"
                    onClick={() => {
                      setActiveStep("guestList");
                    }}
                    text="back"
                    icon="fa-solid fa-arrow-left"
                    classNames="bg-white text-primary border-2 border-primary rounded-full"
                  />
                </div>
              </form>
            )}

            {!singleGuest && (
              <form onSubmit={handleGuestSubmit}>
                <div className="form-control mt-4 flex flex-col gap-4">
                  <label className="text-sm font-poppins-medium">
                    Upload Guest List
                  </label>
                  <input
                    onChange={handleFileUpload}
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    className={`${formFieldClass} bg-secondary cursor-pointer`}
                  />
                </div>
                <div className="form-control mt-8 flex gap-4">
                  <ActionButton
                    text="Upload guest list"
                    icon="fa-solid fa-paper-plane"
                    classNames="w-full bg-primary text-white rounded-full"
                  />

                  <ActionButton
                    type="button"
                    onClick={() => {
                      setActiveStep("guestList");
                    }}
                    text="back"
                    icon="fa-solid fa-arrow-left"
                    classNames="bg-white text-primary border-2 border-primary rounded-full"
                  />
                </div>
              </form>
            )}
          </div>
        )}
        {activeStep == "success" && (
          <div className="text-center text-primary flex flex-col items-center gap-4">
            <span className="text-xl font-poppins-medium">
              Profile Created Successfully
            </span>
            <span className="mt-8 text-2xl font-poppins-bold">
              {guest.name}
            </span>
            <img
              src={`${url}/event/qrcode/${guestDetails.qr_token}`}
              alt="QR code of profile created successfully"
              className="w-2/3 md:w-1/5 mx-auto"
              style={{
                pointerEvents: "none",
              }}
            />
            <p className="w-full flex items-center flex-col md:flex-row gap-2 mx-auto">
              <a
                href={`${url}/event/qrcode/${guestDetails.qr_token}`}
                target="_blank"
                ref={textRef}
                className="w-full text-gray-1 underline break-all"
              >
                {`${url}/event/qrcode/${guestDetails.qr_token}`}
              </a>
              <button
                onClick={() => {
                  copyToClipboard(textRef.current).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  });
                }}
                className="w-3/5 bg-primary text-white rounded-md px-2 py-1 text-sm mx-auto md:mx-0 md:w-auto"
              >
                {copied ? "copied!" : "copy"}
              </button>
            </p>
            <div className="form-control mt-8 flex gap-4">
              <ActionButton
                onClick={() => {
                  setActiveStep("addGuest");
                  setGuest({ name: "", tags: "", email: "", errors: "" });
                }}
                text="Add More Guests"
                classNames="w-full bg-primary text-white rounded-full"
              />
              <ActionButton
                onClick={() => {
                  setActiveStep("guestList");
                  setGuest({ name: "", tags: "", email: "", errors: "" });
                }}
                text="Cancel"
                classNames="bg-white text-primary border-2 border-primary rounded-full"
              />
            </div>
          </div>
        )}
      </Modal>

      <Overlay />

      {/* Action buttons for editing event details */}
      {isFormActive ? (
        <p
          id="formActions"
          className="animate__animated animate__fadeInUp absolute w-full left-0 bottom-0 grid grid-cols-2 md:flex justify-start gap-4 p-4 text-sm"
        >
          <button
            onClick={handleDeleteEvent}
            className="flex gap-2 items-center justify-center bg-white text-red py-2 px-4 rounded-md font-poppins-medium my-auto md:m-0"
          >
            Delete event
            <i className="fa-solid fa-trash"></i>
          </button>
          <button
            onClick={() => setIsFormActive(false)}
            className="flex gap-2 items-center justify-center bg-red text-white py-2 px-4 rounded-md font-poppins-medium my-auto md:m-0"
          >
            Cancel changes
            <i className="fa-solid fa-xmark"></i>
          </button>
          <button
            onClick={updateEventDetails}
            className={`${
              !isFormChanged ? "bg-gray-400" : "bg-white"
            } col-span-2 flex gap-2 items-center justify-center py-1 px-16 rounded-md text-primary font-poppins-medium md:ml-auto`}
          >
            Update event
            <i className="fa-solid fa-pen-nib"></i>
          </button>
        </p>
      ) : (
        // Edit Button
        <button
          onClick={() => setIsFormActive(true)}
          className="absolute right-4 bottom-4 bg-white p-2 rounded-full box-shadow-1"
        >
          <img src={icons.edit} alt="Edit icon" className="w-6" />
        </button>
      )}

      {/* End of Floating Elements */}

      <div className="nav flex items-center justify-between text-sm">
        <p className="grid text-left">
          <span>Event Details</span>
        </p>
        <NavButton onClick={() => navigate(-1)} text="Back" />
      </div>
      <Hr />

      <div className="body mt-10">
        <input
          readOnly={!isFormActive}
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleEventFormChange}
          className={`w-full border-l-4 text-lg pl-3 pr-4 py-1 outline-none ${
            isFormActive
              ? "bg-secondary text-primary border-secondary-2"
              : "bg-transparent text-white"
          }`}
        />

        <ul className="mt-8 mb-8 grid gap-2">
          <li className="text-secondary-2 flex items-center gap-2">
            <i className="lni lni-alarm-1"></i>
            <input
              readOnly={!isFormActive}
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleEventFormChange}
              className={`w-full outline-none ${
                isFormActive
                  ? "bg-secondary text-primary"
                  : "bg-transparent text-white"
              }`}
            />
          </li>
          <li className="text-secondary-2 flex items-center gap-2">
            <i className="lni lni-location-arrow-right"></i>
            <input
              readOnly={!isFormActive}
              id="location"
              name="location"
              value={formData.location}
              onChange={handleEventFormChange}
              className={`w-full outline-none ${
                isFormActive
                  ? "bg-secondary text-primary"
                  : "bg-transparent text-white"
              }`}
            />
          </li>
        </ul>
        <Hr />
        <div id="expected_guests" className="mt-10">
          <h3 className="font-poppins-bold">Expected guests</h3>
          <p className="text-sm text-secondary mt-2">
            {formData.expected_guests} guests
          </p>

          <ul
            id="expected_guests"
            className="mt-8 text-sm grid grid-cols-3 gap-4"
          >
            {guestList.map(({ name, tags }, idx) => (
              <li
                key={idx}
                className="flex flex-col text-left bg-secondary-3 border border-shadow rounded-xl p-2"
              >
                <span>{name}</span>
                <ul className="flex gap-1 text-secondary font-poppins-medium text-xs">
                  {tags}
                </ul>
              </li>
            ))}
          </ul>
          <NavButton
            onClick={() => setIsModalActive(true)}
            classNames="block mt-4 py-2 ml-auto"
            text="See Guest List"
          />
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
