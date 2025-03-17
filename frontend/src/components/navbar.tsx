import { icons } from "../constants/media";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed w-full top-0">
      <div className="w-3/5 flex justify-between items-center py-8 mx-auto">
        <img src={icons.logo} alt="logo" className="w-10" />
        <a href="#" className="font-poppins-bold">
          Create Profile
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
