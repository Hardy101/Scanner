import { useNavigate } from "react-router";

const NavMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="nav flex gap-8 items-center text-sm">
      <button
        onClick={() => navigate(-1)}
        className="md:hidden bs-2 rounded-xl bg-white p-3 hover:bg-primary hover:text-white"
      >
        <i className="fa-solid fa-house text-xl"></i>
      </button>

      <span className="font-poppins-bold text-lg">Event Details</span>
    </div>
  );
};

export default NavMenu;
