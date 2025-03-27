import { useNavigate } from "react-router";

import NavButton from "../components/navbutton";
import Hr from "../components/hr";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-primary text-white p-4 md:p-8">
      <div className="nav flex items-center justify-between text-sm">
        <p className="grid text-left">
          <span>Profile</span>
        </p>
        <NavButton onClick={() => navigate(-1)} text="Back" />
      </div>
      <Hr />
    </div>
  );
};

export default Profile;
