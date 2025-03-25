import NavButton from "../components/navbutton";
import Hr from "../components/hr";
import { useNavigate } from "react-router";

const EventDetails: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-primary text-white p-4 md:p-8">
      <div className="nav flex items-center justify-between text-sm">
        <p className="grid text-left">
          <span>Sunday, </span>
          <span>15th October 2025</span>
        </p>
        <NavButton onClick={() => navigate(-1)} text="Back" classNames="" />
      </div>
      <Hr />

      <div className="body mt-10 "></div>
    </div>
  );
};

export default EventDetails;
