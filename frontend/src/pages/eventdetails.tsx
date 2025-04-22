import { useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import NavButton from "../components/navbutton";
import ActionButton from "../components/actionbutton";
import Hr from "../components/hr";
import { icons } from "../constants/media";
import Modal from "../components/modal";
import { useModalState } from "../store/useModalStore";
import Overlay from "../components/overlay";
import { formData } from "./home";
import { url } from "../constants/variables";
import { Guest } from "../constants/interfaces";
import { useToastStore } from "../store/useToastStore";
import { copyToClipboard } from "../utils/functions";

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const textRef = useRef<HTMLSpanElement | null>(null);
  const navigate = useNavigate();

  const { setIsToastActive, setText } = useToastStore();
  const [isFormActive, setIsFormActive] = useState(false); // Track if form is active to show/hide action buttons
  const [isFormChanged, SetisFormChanged] = useState(false); // Track if form is changed to enable the update button
  const [singleGuest, setSingleGuest] = useState(true); // Track if single guest is selected
  const [guest, setGuest] = useState<Guest>({
    name: "",
    tags: "",
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
        setActiveStep("success");
        fetchEventDetails();
        setIsToastActive(true);
        setText("Guest added successfully!");
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
        setIsToastActive(true);
        setText("Guest deleted successfully!");
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
        setIsToastActive(true);
        setText("Event deleted successfully!");
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

  // Load Event Details on initial laod
  useEffect(() => {
    fetchEventDetails();
  }, []);

  return (
    <div className="relative min-h-screen bg-primary text-white p-4 md:p-8">
      {/* Floating Elements */}
      {/* Guest List */}
      <Modal>
        {activeStep == "guestList" && (
          <div className="text-black">
            <button
              onClick={() => setIsModalActive(false)}
              className="absolute top-4 right-4 flex bg-primary text-secondary rounded-md p-1 text-xl transition-all ease-in-out hover:bg-shadow"
            >
              <i className="lni lni-xmark"></i>
            </button>
            <h3 className="font-poppins-bold text-lg">Guest List</h3>
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
            <div className="flex gap-4 justify-end">
              <ActionButton
                onClick={() => setActiveStep("addGuest")}
                text="Add Guest"
                classNames="bg-primary text-white rounded-md"
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
                  @qrscanneer/scarlettjohanson
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
          <form onSubmit={handleGuestSubmit} className="text-black">
            <h3 className="font-poppins-bold text-xl">Add guest to list</h3>
            <p className="relative md:w-1/3 mx-auto grid grid-cols-2 text-sm font-poppins-bold text-primary text-center bg-secondary rounded-2xl p-1 mt-2">
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
              <>
                <div className="form-control grid gap-2 my-4">
                  <p className="text-red font-poppins-bold">{guest.errors}</p>
                </div>
                <div className="form-control grid gap-2">
                  <label className="text-sm">Name of Guest</label>
                  <input
                    type="text"
                    name="name"
                    value={guest.name}
                    onChange={handleGuestFormChange}
                    placeholder="Enter Name"
                    className="bg-white border-2 border-gray-400 text-primary placeholder:text-primary px-2 py-2 text-sm rounded-md focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div className="form-control grid gap-2 mt-4">
                  <label className="text-sm">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={guest.tags}
                    onChange={handleGuestFormChange}
                    placeholder="Enter Tag"
                    className="bg-white border-2 border-gray-400 text-primary placeholder:text-primary px-2 py-2 text-sm rounded-sm"
                    required
                  />
                </div>
              </>
            )}

            {!singleGuest && (
              <>
                <div className="form-control mt-4 flex flex-col gap-4">
                  <label className="text-sm">Upload Guest List</label>
                  <input
                    onChange={handleFileUpload}
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    className="flex items-center gap-2 box-shadow-1 font-poppins-medium px-4 py-2 text-sm"
                  />
                </div>
              </>
            )}

            <div className="form-control mt-8 flex gap-4">
              {singleGuest && (
                <ActionButton
                  text="Add Guest"
                  icon="fa-solid fa-user-plus"
                  classNames="w-full bg-primary text-white rounded-full"
                />
              )}
              {!singleGuest && (
                <ActionButton
                  text="Upload guest list"
                  icon="fa-solid fa-paper-plane"
                  classNames="w-full bg-primary text-white rounded-full"
                />
              )}
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
        {activeStep == "success" && (
          <div className="text-center text-primary">
            <span className="text-xl font-poppins-medium">
              Profile Created Successfully
            </span>
            <span className="mt-8 block">{guest.name}</span>
            <img
              src={icons.qrcode}
              alt="QR code of profile created successfully"
              className="w-1/5 mx-auto"
              style={{
                pointerEvents: "none",
              }}
            />
            <p className="inline-flex items-center flex-wrap gap-2 mx-auto">
              <span ref={textRef} className="text-gray-1 underline">
                @qrscanneer/{guest.name}
              </span>
              <button
                onClick={() => {
                  copyToClipboard(textRef.current).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  });
                }}
                className="bg-primary text-white rounded-md px-2 py-1 text-sm"
              >
                {copied ? "copied!" : "copy"}
              </button>
            </p>
            <div className="form-control mt-8 flex gap-4">
              <ActionButton
                onClick={() => {
                  setActiveStep("addGuest");
                  setGuest({ name: "", tags: "" });
                }}
                text="Add More Guests"
                classNames="w-full bg-primary text-white rounded-full"
              />
              <ActionButton
                onClick={() => {
                  setActiveStep("guestList");
                  setGuest({ name: "", tags: "" });
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
          className="animate__animated animate__fadeInUp absolute w-full left-0 bottom-0 flex justify-start gap-4 p-4 text-sm"
        >
          <button
            onClick={handleDeleteEvent}
            className="flex gap-2 items-center bg-white text-red py-1 px-4 rounded-md font-poppins-bold"
          >
            Delete event
            <i className="fa-solid fa-trash"></i>
          </button>
          <button
            onClick={() => setIsFormActive(false)}
            className="flex gap-2 items-center bg-red text-white py-1 px-4 rounded-md font-poppins-bold"
          >
            Cancel changes
            <i className="fa-solid fa-xmark"></i>
          </button>
          <button
            onClick={updateEventDetails}
            className={`${
              !isFormChanged ? "bg-gray-400" : "bg-white"
            } flex gap-2 items-center ml-auto py-1 px-16 rounded-md text-primary font-poppins-bold`}
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
