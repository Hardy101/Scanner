import { useNavigate } from "react-router";

import NavButton from "../components/navbutton";
import Hr from "../components/hr";
import { profile } from "../constants/media";
import {  useState } from "react";
import { useAuth } from "../context/AuthProvider";

const Profile: React.FC = () => {
  const [isFormActive, setIsFormActive] = useState(false);
  const handleActive = () => {
    setIsFormActive(false);
  };
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <div className="relative min-h-screen bg-primary text-white p-4 md:p-8">
      <div className="nav flex items-center justify-between text-sm">
        <p className="grid text-left">
          <span>Profile</span>
        </p>
        <NavButton onClick={() => navigate(-1)} text="Back" />
      </div>
      <Hr />
      <div className="body mt-10">
        <div className="profile-details">
          <div className="headInfo flex gap-16 items-center justify-between">
            <img
              src={profile}
              alt="profile picture of user"
              className="w-1/6"
            />
            <p className="grow grid gap-4">
              <span>@carminephalange</span>
              <button
                onClick={() => setIsFormActive(true)}
                className="bg-transparent border border-secondary-2 rounded-full font-poppins-medium py-1 px-6 text-sm box-shadow-1"
              >
                Edit Profile
              </button>
            </p>
          </div>
          <div className="mt-10 text-shadow-3">
            <ul className="grid gap-3">
              <li className="flex items-center gap-2">
                <i className="lni lni-user-4"></i>
                <span>{user?.name}</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="lni lni-envelope-1"></i>
                <span>{user?.email}</span>
              </li>
              <li className="flex justify-between items-center gap-2">
                <i className="lni lni-key-1"></i>
                <span className="font-poppins-bold text-lg">*******</span>
                <NavButton text="Show" classNames="text-right ml-auto" />
              </li>
              <li className="flex justify-between items-center gap-2">
                <i className="lni lni-hand-taking-dollar" />
                <span>{user?.plan}</span>
                <NavButton
                  text="Upgrade plan"
                  classNames="text-right ml-auto"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions to be displayed depending on form active state */}
      {isFormActive ? (
        <p
          id="formActions"
          className="absolute w-full left-0 bottom-0 flex justify-between gap-4 p-4 text-sm"
        >
          <button
            onClick={handleActive}
            className="bg-red py-1 px-4 rounded-md text-white font-poppins-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleActive}
            className="flex-grow bg-white py-1 rounded-md text-primary font-poppins-bold"
          >
            Save
          </button>
        </p>
      ) : (
        <p
          id="acctActions"
          className="absolute w-full left-0 bottom-0 flex justify-between gap-4 p-4 text-sm"
        >
          <button className="bg-red py-1 px-4 rounded-md text-white font-poppins-bold">
            Delete Account
          </button>
          <button className="flex-grow bg-white py-1 rounded-md text-primary font-poppins-bold">
            Sign out
          </button>
        </p>
      )}
    </div>
  );
};

export default Profile;
