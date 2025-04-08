import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => Promise<boolean>;
}

import { url } from "../pages/register";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${url}/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not authenticated");
      const response = await res.json();
      setIsAuthenticated(true);
      console.log("User Authenticated", response);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async (): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${url}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("Logout successful", response.data);
        setIsAuthenticated(false);
        return true;
      } else {
        console.error("Logout failed, unexpected response", response.data);
        return false;
      }
    } catch (err) {
      console.error("Logout failed", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
