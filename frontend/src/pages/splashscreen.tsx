import { Link } from "react-router";
import { img } from "../constants/media";

const carousel_imgs = [
  { id: 0, src: img.bd },
  { id: 1, src: img.conference },
  { id: 2, src: img.meeting },
];
const SplashScreen = () => {
  return (
    <div className="min-h-dvh flex flex-col gap-y-8 py-24 text-center">
      <div className="progress flex gap-2 mx-auto">
        <span className="w-16 h-1 bg-black rounded-full"></span>
        <span className="w-16 h-1 bg-gray-1 rounded-full"></span>
        <span className="w-16 h-1 bg-gray-1 rounded-full"></span>
      </div>
      <h1 className="font-dmserif text-4xl px-4">
        Manage your guests and track every Check-in
      </h1>
      <div className="grow w-fit overflow-clip">
        <img
          src={img.conference}
          alt=""
          className="w-4/5 mx-auto rounded-t-full"
        />
      </div>
      <div className="flex flex-col justify-end text-center gap-4 font-ibmplex-medium">
        <Link
          to={"/register"}
          className="w-4/5 md:w-2/5 bg-primary text-white rounded-2xl px-6 py-4 mx-auto"
        >
          <span>Create account</span>
        </Link>
        <Link
          to={"/login"}
          className="w-4/5 md:w-2/5 bg-black text-white rounded-2xl px-6 py-4 mx-auto"
        >
          <span>Sign in</span>
        </Link>
      </div>
      <div className="agreement flex gap-8 font-ibmplex mx-auto font-bold">
        <span>User terms</span>
        <span>Privacy</span>
      </div>
    </div>
  );
};

export default SplashScreen;
