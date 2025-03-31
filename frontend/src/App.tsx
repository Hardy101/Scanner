import { BrowserRouter, Routes, Route } from "react-router";

import "./App.css";
import SplashScreen from "./pages/splashscreen";
import Register from "./pages/register";
import Home from "./pages/home";
import EventDetails from "./pages/eventdetails";
import Scan from "./pages/scan";
import Profile from "./pages/profile";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <main>
      <section className="min-h-screen overflow-clip font-poppins">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="" element={<SplashScreen />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              <Route element={<PrivateRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/event" element={<EventDetails />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </section>
    </main>
  );
}

export default App;
