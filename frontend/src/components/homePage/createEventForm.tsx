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
    time: "",
    location: "",
    image_url: "",
    expected_guests: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const { setIsModalActive } = useModalState();
  const formFields =
    "p-4 border border-black rounded-2xl font-poppins-medium placeholder:font-poppins";
  const formLabelClass = "font-poppins-bold text-lg";

  const refreshEvents = () => {
    fetchEvents();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("time", formData.time);
      formDataToSend.append("location", formData.location);
      formDataToSend.append(
        "expected_guests",
        formData.expected_guests.toString()
      );

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      const response = await axios.post(`${url}/event/add`, formDataToSend, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response && response.status === 200) {
        const eventId = response.data.id;
        resetForm();
        setSelectedFile(null);
        setIsModalActive(false);
        navigate(`/event/${eventId}`);
        refreshEvents();
      }
    } catch (err: any) {
      console.error(err.response.data);
      setFormError(
        err.response.data.detail ||
          err.response.data.message ||
          "An error occurred"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      time: "",
      location: "",
      image_url: "",
      expected_guests: 0,
    });
    setSelectedFile(null);
    setFormError("");
  };

  return (
    <div
      className={`fixed w-full h-full top-0 ${
        isCreateEventActive ? "translate-y-0" : "translate-y-full"
      } left-0 bg-white font-poppins overflow-y-auto z-20 transition-all ease-in-out duration-500`}
    >
      <div className="heading px-4 pt-4">
        <button
          onClick={() => {
            setIsCreateEventActive(false);
            resetForm();
          }}
          type="button"
          className="px-3 py-2 flex items-center rounded-md bs-2 text-xl hover:bg-primary hover:text-white"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form className="grid gap-y-8 p-8" onSubmit={handleSubmit}>
        <div className="heading flex items-center gap-4">
          <h2 className="text-3xl font-poppins-bold">Create Event</h2>
        </div>
        {formError && (
          <div className="form-control">
            <p className="text-red font-poppins-bold text-xl">{formError}</p>
          </div>
        )}

        {/* Upload Form field */}
        <div className="form-control grid gap-y-3">
          <span className={formLabelClass}>
            Upload file{" "}
            <span className="text-base font-poppins">(optional)</span>
          </span>
          <label
            htmlFor="file"
            className="flex flex-col gap-2 items-center py-4 border-2 border-black border-dashed rounded-2xl cursor-pointer"
          >
            {selectedFile ? (
              <span className="text-sm font-poppins-bold text-gray-600">
                {selectedFile.name}
              </span>
            ) : (
              <>
                <i className="fa-solid fa-image text-5xl text-primary"></i>
                <span>Drag or drop image to upload</span>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border font-poppins-bold text-primary hover:text-white hover:bg-primary"
                >
                  Select files
                </button>
              </>
            )}
          </label>
          <input
            type="file"
            name="file"
            id="file"
            onChange={handleFileChange}
            accept="image/*"
            hidden
          />
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
          <input
            type="date"
            name="date"
            id="date"
            onChange={handleChange}
            value={formData.date}
            className={formFields}
          />
          <input
            type="time"
            name="time"
            id="time"
            onChange={handleChange}
            value={formData.time}
            className={formFields}
          />
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

        {/* Number of guests form field */}
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
        {/* Number of guests form field */}

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
            className="flex flex-col gap-2 items-center py-4 border-2 border-black border-dashed rounded-2xl"
          >
            <i className="fa-solid fa-file-excel text-5xl text-primary"></i>
            <span>Drag or drop files to upload</span>
            <button
              type="button"
              className="px-4 py-2 rounded-md border font-poppins-bold text-primary hover:text-white hover:bg-primary"
            >
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
          <div className="input grid grid-cols-3 gap-4">
            <input
              type="text"
              name="activity"
              id="activity"
              placeholder="activity"
              className={`col-span-2 ${formFields}`}
            />
            <input
              type="number"
              name="h-time"
              id="h-time"
              className={formFields}
            />
          </div>
          <button
            type="button"
            className="ml-auto px-3 py-2 flex gap-2 items-center rounded-2xl bs-2 bg-primary text-white"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add</span>
          </button>
        </div>
        {/* End of Highlights Form field */}
        <div className="form-control grid gap-y-3">
          <button className="px-2 py-4 bg-primary font-poppins-bold text-lg text-white rounded-3xl">
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;
