import { useNavigate } from "react-router";

const NavMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="nav flex gap-8 items-center text-sm">
      <button
        onClick={() => navigate(-1)}
        className="bs-2 rounded-md bg-white px-2 py-1 hover:bg-primary hover:text-white text-base"
      >
        <i className="fa-solid fa-house"></i>
      </button>

      <span className="font-poppins-bold text-lg">Event Details</span>
    </div>
  );
};

export default NavMenu;
