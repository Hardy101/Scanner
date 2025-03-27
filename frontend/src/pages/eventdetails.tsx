import { useNavigate } from "react-router";
import { useRef, useState } from "react";

import NavButton from "../components/navbutton";
import Hr from "../components/hr";
import { icons } from "../constants/media";
import Modal from "../components/modal";
import { useModalState } from "../store/useModalStore";
import Overlay from "../components/overlay";

const guestList = [
  { id: 0, initials: "DA", name: "David Aguero", tags: ["vip", "family"] },
  { id: 1, initials: "BL", name: "Brock Lesnar", tags: ["wrestler"] },
  { id: 2, initials: "RG", name: "Ross Geller", tags: ["killer"] },
];

const EventDetails: React.FC = () => {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const navigate = useNavigate();

  const { setIsModalActive } = useModalState();
  const [activeStep, setActiveStep] = useState("guestList");
  const [copied, setCopied] = useState(false);

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
              {guestList.map(({ id, initials, name, tags }) => (
                <li key={id} className="flex items-center gap-2 pb-2">
                  <span className="p-2 bg-primary text-white rounded-full my-auto">
                    {initials}
                  </span>
                  <div className="flex flex-col">
                    <span>{name}</span>
                    <ul className="flex gap-1 font-poppins-bold text-primary">
                      {tags.map((tag, idx) => (
                        <li key={idx}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setActiveStep("addGuest")}
              className="block box-shadow-1 bg-primary text-white font-poppins-bold px-4 py-2 rounded-md text-sm mt-8 ml-auto"
            >
              Add Guest
            </button>
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
              <button
                onClick={() => setActiveStep("success")}
                className="w-full box-shadow-1 bg-primary text-white font-poppins-bold px-6 py-2 rounded-full text-sm mx-auto"
              >
                Add Guest
              </button>
              <button
                onClick={() => setActiveStep("guestList")}
                className="box-shadow-1 bg-white text-primary border-2 border-primary font-poppins-bold px-6 py-2 rounded-full text-sm mx-auto"
              >
                Cancel
              </button>
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
              className="w-1/2 mx-auto"
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
              <button
                onClick={() => setActiveStep("addGuest")}
                className="w-full box-shadow-1 bg-primary text-white font-poppins-bold px-6 py-2 rounded-full text-sm mx-auto"
              >
                Add More Guests
              </button>
              <button
                onClick={() => setActiveStep("guestList")}
                className="box-shadow-1 bg-white text-primary border-2 border-primary font-poppins-bold px-6 py-2 rounded-full text-sm mx-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
      <button className="absolute right-4 bottom-4 bg-white p-2 rounded-full box-shadow-1">
        <img src={icons.edit} alt="Edit icon" className="w-6" />
      </button>

      <Overlay />
      {/* End of Floating Elements */}
      <div className="nav flex items-center justify-between text-sm">
        <p className="grid text-left">
          <span>Event Details</span>
        </p>
        <NavButton onClick={() => navigate(-1)} text="Back" classNames="" />
      </div>
      <Hr />

      <div className="body mt-10">
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

          <ul id="guests" className="mt-8 text-sm grid grid-cols-3 gap-4">
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
            classNames="block mt-4 py-2 mx-auto"
            text="See all guests"
          />
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
