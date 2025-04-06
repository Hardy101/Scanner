import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import useDataStore from "../store/useDataStore";

const PrivateRoutes: React.FC = () => {
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/auth/me", {
        withCredentials: true, // Send cookies with request
      });

      const userData = response.data;
      useDataStore.getState().setUser(userData); // Update Zustand store
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const { isAuthenticated } = useAuth(); // Check if user is authenticated

  useEffect(() => {
    // If user is authenticated, fetch user data
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  // If not authenticated, redirect to login, else render the private content
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
