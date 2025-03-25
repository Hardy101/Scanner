import { BrowserRouter, Routes, Route } from "react-router";

import "./App.css";
import SplashScreen from "./pages/splashscreen";

function App() {
  return (
    <main className="bg-secondary-2 md:p-8">
      <div className="min-h-screen border border-secondary rounded-2xl mx-auto md:w-2/5 overflow-clip">
        <BrowserRouter>
          <Routes>
            <Route path={""} element={<SplashScreen />} />
          </Routes>
        </BrowserRouter>
        <SplashScreen />
      </div>
    </main>
  );
}

export default App;
