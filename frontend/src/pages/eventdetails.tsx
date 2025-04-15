import { useNavigate } from "react-router";
import { useRef, useState } from "react";

import NavButton from "../components/navbutton";
import ActionButton from "../components/actionbutton";
import Hr from "../components/hr";
import { icons } from "../constants/media";
import Modal from "../components/modal";
import { useModalState } from "../store/useModalStore";
import Overlay from "../components/overlay";
import { formData } from "./home";

const guestList = [
  { id: 0, initials: "DA", name: "David Aguero", tags: ["vip", "family"] },
  { id: 1, initials: "BL", name: "Brock Lesnar", tags: ["wrestler"] },
  { id: 2, initials: "RG", name: "Ross Geller", tags: ["killer"] },
];

const EventDetails: React.FC = () => {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const navigate = useNavigate();

  const [isFormActive, setIsFormActive] = useState(false);
  const { setIsModalActive } = useModalState();
  const [activeStep, setActiveStep] = useState("guestList");
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<formData>({
    name: "Birthday Party",
    date: "2025-03-29",
    location: "15 Caramet Hall off Jump off bridge",
    expected_guests: 50,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCopy = () => {
    if (textRef.current) {
      const textToCopy = textRef.current.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

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
            <ul className="grid gap-2 divide-y divide-secondary-2 mt-6 text-xs">
              {guestList.map(({ id, name, tags }) => (
                <li
                  onClick={() => setActiveStep("guestDetails")}
                  key={id}
                  className="flex flex-col pb-2"
                >
                  <span>{name}</span>
                  <ul className="flex gap-1 font-poppins-bold text-primary">
                    {tags.map((tag, idx) => (
                      <li key={idx}>{tag}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 justify-end">
              <ActionButton
                text="Upload Guest List (*.csv, *.xls)"
                icon="fa-solid fa-upload"
                classNames="bg-primary text-white rounded-md"
              />
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
                  onClick={() => handleCopy()}
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
            <h3 className="font-poppins-bold text-lg">Add Guest</h3>
            <div className="form-control grid gap-2 mt-4">
              <label className="text-sm">Name of Guest</label>
              <input
                type="text"
                placeholder="Enter Name"
                className="w-full bg-secondary text-primary placeholder:text-primary px-2 py-2 text-xs rounded-sm"
              />
            </div>
            <div className="form-control grid gap-2 mt-2">
              <label className="text-sm">Tag</label>
              <input
                type="text"
                placeholder="Enter Tag"
                className="w-full bg-secondary text-primary placeholder:text-primary px-2 py-2 text-xs rounded-sm"
              />
            </div>
            <div className="form-control mt-8 flex gap-4">
              <ActionButton
                onClick={() => setActiveStep("success")}
                text="Add Guest"
                classNames="w-full bg-primary text-white rounded-full"
              />
              <ActionButton
                onClick={() => {
                  setActiveStep("guestList");
                }}
                text="Cancel"
                classNames="bg-white text-primary border-2 border-primary rounded-full"
              />
            </div>
          </div>
        )}
        {activeStep == "success" && (
          <div className="text-center text-primary">
            <span className="text-xl font-poppins-medium">
              Profile Created Successfully
            </span>
            <span className="mt-8 block">Scarlett Johanson</span>
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
                @qrscanneer/scarlettjohanson
              </span>
              <button
                onClick={() => handleCopy()}
                className="bg-primary text-white rounded-md px-2 py-1 text-sm"
              >
                {copied ? "copied!" : "copy"}
              </button>
            </p>
            <div className="form-control mt-8 flex gap-4">
              <ActionButton
                onClick={() => setActiveStep("addGuest")}
                text="Add More Guests"
                classNames="w-full bg-primary text-white rounded-full"
              />
              <ActionButton
                onClick={() => setActiveStep("guestList")}
                text="Cancel"
                classNames="bg-white text-primary border-2 border-primary rounded-full"
              />
            </div>
          </div>
        )}
      </Modal>

      <Overlay />

      {/* Logic For editing event details */}
      {isFormActive ? (
        <p
          id="formActions"
          className="absolute w-full left-0 bottom-0 flex justify-between gap-4 p-4 text-sm"
        >
          <button
            onClick={() => setIsFormActive(false)}
            className="bg-red py-1 px-4 rounded-md text-white font-poppins-bold"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsFormActive(false)}
            className="flex-grow bg-white py-1 rounded-md text-primary font-poppins-bold"
          >
            Save
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
        <NavButton onClick={() => navigate(-1)} text="Back" classNames="" />
      </div>
      <Hr />

      <div className="body mt-10">
        <input
          readOnly={!isFormActive}
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`border-l-4 text-lg pl-3 pr-4 py-1 outline-none ${
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
              onChange={handleChange}
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
              onChange={handleChange}
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
          <h3 className="font-poppins-bold">expected_guests</h3>
          <p className="text-sm text-secondary mt-2">
            {formData.expected_guests} expected_guests
          </p>

          <ul
            id="expected_guests"
            className="mt-8 text-sm grid grid-cols-3 gap-4"
          >
            {guestList.map(({ id, name, tags }) => (
              <li
                key={id}
                className="flex flex-col text-left bg-secondary-3 border border-shadow rounded-xl p-2"
              >
                <span>{name}</span>
                <ul className="flex gap-1 text-secondary font-poppins-medium text-xs">
                  {tags.map((tag, idx) => (
                    <li key={idx}>{tag}</li>
                  ))}
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
