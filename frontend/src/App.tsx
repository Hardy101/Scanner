import { BrowserRouter, Routes, Route } from "react-router";

import "./App.css";
import SplashScreen from "./pages/splashscreen";
import Register from "./pages/register";

function App() {
  return (
    <main className="bg-secondary-2 md:p-8">
      <section className="min-h-screen mx-auto md:w-2/5 overflow-clip font-poppins">
        <BrowserRouter>
          <Routes>
            <Route path="" element={<SplashScreen />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </section>
    </main>
  );
}

export default App;
