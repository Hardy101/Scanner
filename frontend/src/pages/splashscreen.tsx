import { Link } from "react-router";

import { icons } from "../constants/media";

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-primary grid gap-16">
      <img
        src={icons.logo}
        alt="Logo"
        className="w-1/5 mx-auto mt-auto"
        style={{
          pointerEvents: "none",
        }}
      />
      <p className="flex flex-col gap-4">
        <Link
          to={""}
          className="w-4/5 bg-white text-primary text-sm box-shadow-1 font-bold rounded-full px-6 py-2 mx-auto"
        >
          <span>Register</span>
        </Link>
        <button className="w-4/5 bg-primary text-white text-sm border border-shadow box-shadow-1 font-bold rounded-full px-6 py-2 mx-auto">
          <span>Login</span>
        </button>
      </p>
    </div>
  );
};

export default SplashScreen;
