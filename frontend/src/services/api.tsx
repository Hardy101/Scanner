import axios from "axios";

const API_URL = "http://localhost:8000"; // Update to your FastAPI backend

interface userData {
  name: string;
  email: string;
  password: string;
}

// Register User
export const registerUser = async (userData: userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

// Login User
export const loginUser = async (userData: userData) => {
  return axios.post(`${API_URL}/auth/login`, userData);
};

// Store Token
export const storeToken = (token: string) => {
  localStorage.setItem("token", token);
};

// Get Auth Headers
export const getAuthHeaders = () => {
  return {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
};
