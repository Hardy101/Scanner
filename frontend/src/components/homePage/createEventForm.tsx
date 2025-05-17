import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

// Local imports
import { CreateEventFormProps } from "../../constants/interfaces";
import { useEventStore } from "../../store/useEventsStore";
import { useModalState } from "../../store/useModalStore";
import { url } from "../../constants/variables";
import { EventFormData } from "../../constants/interfaces";

const CreateEventForm: React.FC<CreateEventFormProps> = ({
  isCreateEventActive,
  setIsCreateEventActive,
}) => {
  const { fetchEvents } = useEventStore();
  const [formData, setFormData] = useState<EventFormData>({
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
  const formFields =
    "px-2 py-4 border border-black rounded-md font-poppins-medium placeholder:font-poppins";
  const formLabelClass = "font-poppins-bold text-xl";

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
    <div
      className={`fixed w-full h-full top-0 ${
        isCreateEventActive ? "translate-y-0" : "translate-y-full"
      } left-0 bg-white font-poppins p-4 overflow-y-auto z-20 transition-all ease-in-out duration-500`}
    >
      <form className="grid gap-y-8" onSubmit={handleSubmit}>
        <div className="form-control flex items-center gap-8">
          <button
            onClick={() => setIsCreateEventActive(false)}
            type="button"
            className="p-4 flex items-center rounded-full bs-2 text-xl"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2 className="text-3xl font-poppins-bold">Create Event</h2>
        </div>
        <div className="form-control">
          {formError && (
            <p className="text-red font-poppins-bold text-xl">{formError}</p>
          )}
        </div>

        {/* Upload Form field */}
        <div className="form-control grid gap-y-3">
          <span className={formLabelClass}>
            Upload file{" "}
            <span className="text-base font-poppins">(optional)</span>
          </span>
          <label
            htmlFor="file"
            className="flex flex-col gap-2 items-center py-4 border-2 border-black border-dashed rounded-md"
          >
            <i className="fa-solid fa-image text-5xl text-primary"></i>
            <span>Drag or drop files to upload</span>
            <button className="px-4 py-2 rounded-md border font-poppins-bold text-primary">
              Select files
            </button>
          </label>
          <input type="file" name="file" id="file" hidden />
        </div>
        {/* End of Upload Form field */}
        {/* Name of Event form field */}
        <div className="form-control grid gap-y-3">
          <label htmlFor="name" className={formLabelClass}>
            Name of Event
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={formFields}
            placeholder="Min Char 4."
          />
        </div>
        {/* Name of Event form field */}
        {/* Date and time event form field*/}
        <div className="form-control grid grid-cols-2 gap-y-3 gap-x-8">
          <label
            htmlFor="date"
            className={`${formLabelClass} col-span-2 grid grid-cols-2`}
          >
            Date
          </label>
          <input type="date" name="date" id="date" className={formFields} />
          <input type="time" name="time" id="time" className={formFields} />
        </div>
        {/* End of Date and time event form field */}

        {/* Location of Event form field */}
        <div className="form-control grid gap-y-3">
          <label htmlFor="location" className={formLabelClass}>
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className={formFields}
            placeholder="Min Char 4."
          />
        </div>
        {/* Location of Event form field */}

        {/* Name of Event form field */}
        <div className="form-control grid gap-y-3">
          <label htmlFor="expected_guests" className={formLabelClass}>
            Expected number of guests
          </label>
          <input
            type="number"
            name="expected_guests"
            id="expected_guests"
            value={formData.expected_guests}
            onChange={handleChange}
            className={formFields}
            min={1}
            placeholder="Min 1."
          />
        </div>
        {/* Name of Event form field */}
        {/* Upload Form field */}
        <div className="form-control grid gap-y-3">
          <div className="label">
            <span className={formLabelClass}>
              Guest list{" "}
              <span className="text-base font-poppins">(optional)</span>
            </span>
            <p className="italic">
              see{" "}
              <span className="text-primary font-poppins-bold">
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
            <button className="px-4 py-2 rounded-md border font-poppins-bold text-primary">
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
            className={`flex items-baseline gap-2 ${formLabelClass}`}
          >
            Highlights
            <span className="text-base font-poppins">(optional)</span>
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
          <button className="px-2 py-4 bg-primary font-poppins-bold text-lg text-white rounded-md">
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;
