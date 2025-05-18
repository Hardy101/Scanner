// local Imports
import Hr from "../components/hr";
import Modal from "../components/modal";
import { useModalState } from "../store/useModalStore";
import Overlay from "../components/overlay";
import ModalActions from "../components/eventDetails/modalActions";
import NavMenu from "../components/eventDetails/navMenu";
import EventInfo from "../components/eventDetails/eventInfo";
import { useState } from "react";
import { EventFormData } from "../constants/interfaces";

const EventDetails: React.FC = () => {
  const { setIsModalActive } = useModalState();
  const [guestList, setGuestList] = useState([{ id: "", name: "", tags: "" }]);
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    date: "",
    location: "",
    expected_guests: 0,
  });

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      {/* Floating Elements */}

      {/* Guest List && Guest Add */}
      <Modal>
        <button
          onClick={() => setIsModalActive(false)}
          className="absolute top-4 right-4 flex bg-black text-secondary rounded-md p-1 text-xl transition-all ease-in-out hover:scale-150"
        >
          <i className="lni lni-xmark"></i>
        </button>
        <ModalActions formData={formData} setFormData={setFormData} />
      </Modal>
      <Overlay />
      {/* End of Floating Elements */}

      <NavMenu />
      <Hr />

      <div className="body mt-4 pb-12">
        <EventInfo guestList={guestList} setGuestList={setGuestList} />
      </div>
    </div>
  );
};

export default EventDetails;
// setIsFormActive(true)}
