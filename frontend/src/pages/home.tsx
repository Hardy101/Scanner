import NavButton from "../components/navbutton";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary text-white p-8">
      <div className="nav flex items-center justify-between">
        <p className="grid text-left">
          <span>Sunday, </span>
          <span>15th October 2025</span>
        </p>
        <NavButton classNames="" text="Menu" />
      </div>
    </div>
  );
};

export default Home;
