import Hr from "./hr";
const DropdownNav: React.FC = () => {
  return (
    <div className="w-5/6 absolute top-15 left-10 bg-[#225050] rounded-xl px-4 pt-10 pb-2 z-2">
      <button className="absolute flex bg-shadow text-secondary rounded-md p-1 text-xl right-4 top-4">
        <i className="lni lni-xmark"></i>
      </button>
      <ul className="text-sm text-secondary ">
        <li className="hover:text-white">
          <span>Profile</span>
        </li>
        <li className="hover:text-white">
          <span>Analytics</span>
        </li>
      </ul>
      <div>
        <Hr />
        <button>Add Event</button>
      </div>
    </div>
  );
};

export default DropdownNav;
