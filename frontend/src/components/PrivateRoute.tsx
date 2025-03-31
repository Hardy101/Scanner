// components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth"; // Import the updated isAuthenticated function

const PrivateRoute = () => {
  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the protected route
  return <Outlet />;
};

export default PrivateRoute;
