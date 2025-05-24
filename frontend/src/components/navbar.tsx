import { Link } from "react-router";

const navClass = "flex gap-2 items-center px-4 py-2 rounded-full";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed w-full left-0 bottom-0 p-4 md:hidden z-5">
      <ul className="w-fit bg-black rounded-full py-2 px-2 text-white flex items-center justify-between">
        <li>
          <Link to={"/"} className={`${navClass} bg-primary`}>
            <i className="fa-solid fa-house"></i>
            <span className="text-sm">Home</span>
          </Link>
        </li>
        <li>
          <Link to={"/analytics"} className={`${navClass}`}>
            <i className="fa-solid fa-chart-pie"></i>
            <span className="hidden text-sm">Analytics</span>
          </Link>
        </li>
        <li>
          <Link to={"/"} className={`${navClass}`}>
            <i className="fa-solid fa-gears"></i>
            <span className="hidden text-sm">Settings</span>
          </Link>
        </li>
        <li>
          <Link to={"/profile"} className={`${navClass}`}>
            <i className="fa-solid fa-user"></i>
            <span className="hidden text-sm">Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
