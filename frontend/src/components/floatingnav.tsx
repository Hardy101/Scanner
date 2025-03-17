import { icons } from "../constants/media";

const FloatingNav: React.FC = () => {
  return (
    <div id="floatingnav fixed bottom-0 w-full bg-purple">
      <div className="w-full flex justify-between md:3/5 py-4 px-16 font-poppins-bold">
        <a href="#" className="inline-flex items-center">
          <img src={icons.home} alt="home icon" />
          <span>Home</span>
        </a>
        <a href="#" className="absolute -top-5">
          <span className="p-2 rounded-full m-2">
            <img src={icons.scan} alt="scan icon" className="h-full w-full" />
          </span>
        </a>
        <a href="#" className="inline-flex items-center">
          <img src={icons.person} alt="person" />
          <span>Profiles</span>
        </a>
      </div>
    </div>
  );
};

export default FloatingNav;
