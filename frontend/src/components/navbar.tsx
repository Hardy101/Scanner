import { Link } from "react-router";

const navClass = "flex gap-2 items-center px-4 py-2 rounded-full";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed w-full left-0 bottom-0 p-4 flex justify-center md:hidden z-5">
      <ul className="w-4/5 bg-black rounded-full py-4 px-4 text-white flex items-center justify-between">
        <li>
          <Link
            to={"/"}
            className={`${navClass} bg-primary`}
          >
            <i className="fa-solid fa-house text-xl"></i>
            <span className="">Home</span>
          </Link>
        </li>
        <li>
          <Link to={"/"} className={`${navClass}`}>
            <i className="fa-solid fa-chart-pie text-xl"></i>
            <span className="hidden">Analytics</span>
          </Link>
        </li>
        <li>
          <Link to={"/"} className={`${navClass}`}>
            <i className="fa-solid fa-gears text-xl"></i>
            <span className="hidden">Settings</span>
          </Link>
        </li>
        <li>
          <Link to={"/"} className={`${navClass}`}>
            <i className="fa-solid fa-user text-xl"></i>
            <span className="hidden">Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
