import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const PrivateRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
