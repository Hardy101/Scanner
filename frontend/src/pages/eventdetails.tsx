// local Imports
import Hr from "../components/hr";
import Modal from "../components/modal";
import { useModalState } from "../store/useModalStore";
import Overlay from "../components/overlay";
import ModalAction from "../components/eventDetails/modalActions";
import NavMenu from "../components/eventDetails/navMenu";
import EventInfo from "../components/eventDetails/eventInfo";

const EventDetails: React.FC = () => {
  const { setIsModalActive } = useModalState();

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      {/* Floating Elements */}

      {/* Guest List && Guest Add */}
      <Modal>
        <button
          onClick={() => setIsModalActive(false)}
          className="absolute top-4 right-4 flex bg-primary text-secondary rounded-md text-3xl transition-all ease-in-out hover:bg-shadow"
        >
          <i className="lni lni-xmark"></i>
        </button>
        <ModalAction />
      </Modal>
      <Overlay />
      {/* End of Floating Elements */}

      <NavMenu />
      <Hr />

      <div className="body mt-4 pb-12">
        <EventInfo />
      </div>
    </div>
  );
};

export default EventDetails;
// setIsFormActive(true)}
