import NavButton from "../components/navbutton";
import Hr from "../components/hr";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary text-white p-4 md:p-8">
      <div className="nav flex items-center justify-between">
        <p className="grid text-left">
          <span>Sunday, </span>
          <span>15th October 2025</span>
        </p>
        <NavButton classNames="" text="Menu" />
      </div>
      <Hr />
      <div className="body mt-10">
        <h2 className="text-2xl font-poppins-bold">Hi, Peter</h2>
        <p className="text-sm text-secondary">Welcome back, hope your doing well today?</p>
      </div>
    </div>
  );
};

export default Home;
