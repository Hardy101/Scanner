import { icons } from "../constants/media";

const FloatingNav: React.FC = () => {
  return (
    <div id="floatingnav" className="fixed bottom-0 w-full ">
      <div className="w-full flex justify-between md:w-3/5 mx-auto py-4 px-8 font-poppins-medium text-white bg-purple-1 rounded-t-2xl text-sm md:text-base">
        <a href="#" className="flex flex-col">
          <img
            src={icons.home}
            alt="home icon"
            className="w-5 md:w-8 mx-auto"
          />
          <span>Home</span>
        </a>
        <a
          href="#"
          className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full border-4 border-white"
        >
          <span className="flex p-4 rounded-full bg-purple-1">
            <img src={icons.scan} alt="scan icon" className="w-8 md:w-14 h-auto m-auto" />
          </span>
        </a>
        <a href="#" className="flex flex-col">
          <img src={icons.person} alt="person" className="w-5 md:w-8 mx-auto" />
          <span>Profiles</span>
        </a>
      </div>
    </div>
  );
};

export default FloatingNav;
