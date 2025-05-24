import { useState } from "react";

// Local imports
import Navbar from "../components/navbar";
import Overlay from "../components/overlay";
import TopNavigation from "../components/homePage/topNavigation";
import CustomSelect from "../components/customSelectField";
import Hr from "../components/hr";

const options = [
  { text: "Birthday Party", value: "birthdayparty" },
  { text: "Meeting", value: "meeting" },
];

const analyticsParamsClasses = "grid grid-col-3 items-center gap-x-4 gap-y-2";

const Analytics: React.FC = () => {
  const [isCreateEventActive, setIsCreateEventActive] = useState(false);

  return (
    <div className="relative h-dvh md:px-8 pb-32">
      <Navbar />
      <Overlay />
      <TopNavigation
        isCreateEventActive={isCreateEventActive}
        setIsCreateEventActive={setIsCreateEventActive}
      />

      <div className="main mt-10">
        <div className="heading flex items-center justify-between">
          <h1 className="text-2xl font-poppins-bold">Dashboard</h1>
          <CustomSelect
            name="eventSelect"
            id="eventSelect"
            options={options}
            customClassNames="font-poppins"
          />
        </div>

        <div className="body mt-10">
          <h2 className="text-xl font-poppins-bold mb-4">
            Overview
          </h2>
          <Hr />
          <div className="analytics mt-4 grid grid-cols-6 gap-y-8">
            <h3 className="col-span-6 text-lg font-poppins-medium">Birthday Party</h3>
            <p className={analyticsParamsClasses}>
              <span className="text-gray-1 text-sm">Expected guests</span>
              <span className="text-3xl font-poppins-bold">400</span>
            </p>
            <p className={analyticsParamsClasses}>
              <span className="col-span-3 text-gray-1 text-sm">No-shows</span>
              <span className="text-3xl font-poppins-bold">350</span>
              <span className="flex gap-2 items-center w-fit bg-red-100 text-sm text-black px-4 py-px rounded-full">
                <b className="text-red-500 text-xl">•</b>
                20
              </span>
            </p>
            <p className={analyticsParamsClasses}>
              <span className="col-span-3 text-gray-1 text-sm">
                Check-ins
              </span>
              <span className="text-3xl font-poppins-bold">50</span>
              <span className="flex gap-2 items-center w-fit bg-green-200 text-sm text-black px-4 py-px rounded-full">
                <b className="text-green-500 text-xl">•</b>
                20%
              </span>
            </p>
            <p className={analyticsParamsClasses}>
              <span className="col-span-3 text-gray-1 text-sm">
                Check-outs
              </span>
              <span className="text-3xl font-poppins-bold">0</span>
              <span className="flex gap-2 items-center w-fit bg-amber-200 text-sm text-black px-4 py-px rounded-full">
                <b className="text-amber-500 text-xl">•</b>
                0%
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
