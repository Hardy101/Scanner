import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const PrivateRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};


export default PrivateRoutes;
 