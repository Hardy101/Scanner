import { icons } from "../constants/media";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed w-full top-0">
      <div className="md:w-3/5 flex justify-between items-center px-4 py-8 mx-auto md:px-0">
        <img src={icons.logo} alt="logo" className="w-10" />
        <a href="#" className="font-poppins-medium">
          Create Profile
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
