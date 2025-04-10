import { Link } from "react-router";

import { icons } from "../constants/media";

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-primary flex flex-col gap-16 py-24">
      <img
        src={icons.logo}
        alt="Logo"
        className="w-1/6 mx-auto"
        style={{
          pointerEvents: "none",
        }}
      />
      <div className="flex flex-col text-center text-sm font-bold gap-4">
        <Link
          to={"/register"}
          className="w-4/5 md:w-2/5 bg-white text-primary box-shadow-1 rounded-full px-6 py-4 mx-auto"
        >
          <span>Register</span>
        </Link>
        <Link
          to={"/login"}
          className="w-4/5 md:w-2/5 bg-primary text-white border border-shadow box-shadow-1 rounded-full px-6 py-4 mx-auto"
        >
          <span>Login</span>
        </Link>
      </div>
    </div>
  );
};

export default SplashScreen;
