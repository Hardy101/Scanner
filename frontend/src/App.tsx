import { BrowserRouter, Routes, Route } from "react-router";

import "./App.css";
import SplashScreen from "./pages/splashscreen";
import Register from "./pages/register";
import Home from "./pages/home";
import EventDetails from "./pages/eventdetails";
import Scan from "./pages/scan";

function App() {
  return (
    <main className="bg-secondary-2 md:p-8">
      <section className="min-h-screen mx-auto md:w-2/5 overflow-clip font-poppins">
        <BrowserRouter>
          <Routes>
            <Route path="" element={<SplashScreen />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/event" element={<EventDetails />} />
            <Route path="/scan" element={<Scan />} />
          </Routes>
        </BrowserRouter>
      </section>
    </main>
  );
}

export default App;
