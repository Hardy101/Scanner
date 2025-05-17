import { useEffect, useState } from "react";

// Local imports
import DropdownNav from "../components/dropdownnav";
import Overlay from "../components/overlay";
import { useEventStore } from "../store/useEventsStore";
import LoadingComponent from "../components/loading";
import Navbar from "../components/navbar";
import EventList from "../components/homePage/EvenList";
import TopNavigation from "../components/homePage/topNavigation";
import CreateEventForm from "../components/homePage/createEventForm";

const Home: React.FC = () => {
  const { events, isLoading, fetchEvents } = useEventStore();
  const [isCreateEventActive, setIsCreateEventActive] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="relative min-h-dvh p-4 md:p-8">
      {/* Floating Elements */}
      <CreateEventForm
        isCreateEventActive={isCreateEventActive}
        setIsCreateEventActive={setIsCreateEventActive}
      />
      <Navbar />
      <Overlay />
      <DropdownNav />
      {/* End of floating Elements */}
      <TopNavigation
        isCreateEventActive={isCreateEventActive}
        setIsCreateEventActive={setIsCreateEventActive}
      />

      <div className="body mt-10 ">
        {/* Upcoming events div */}
        <div className="w-fit flex flex-col gap-y-8 bg-primary px-4 py-8 rounded-3xl text-white">
          <span className="w-fit px-2 rounded-full text-3xl font-ibmplex-bold text-primary bg-white">
            {events.length}
          </span>
          <span className="text-2xl font-ibmplex-bold">Upcoming events</span>
        </div>

        <h2 className="text-3xl font-ibmplex-bold mt-8">Events this month</h2>

        {isLoading ? <LoadingComponent /> : <EventList />}
      </div>
    </div>
  );
};

export default Home;
