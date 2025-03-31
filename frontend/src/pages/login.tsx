import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

import { url } from "./register";

interface formData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<formData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email: string;
    password: string;
    general: string;
  }>({
    email: "",
    password: "",
    general: "",
  });

  const validateForm = () => {
    let valid = true;
    let newErrors = { name: "", email: "", password: "", general: "" };

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const response = axios.post(`${url}/auth/login`, formData);
      response
        .then((res) => navigate("/home"))
        .catch((err: any) => {
          console.error("Login Error", err),
            setErrors((prev) => ({
              ...prev,
              general:
                err.response.data.detail ||
                "Something went wrong, please fill the form again",
            }));
        });
    }
  };
  const formFieldClasses =
    "bg-transparent text-secondary font-poppins placeholder:text-secondary border border-shadow text-xs px-4 py-3 rounded-md";

  return (
    <div className="min-h-screen bg-primary pt-16 flex flex-col gap-4 text-white text-center">
      <h2 className="text-2xl font-poppins-bold">Welcome back</h2>
      <p className="text-sm">
        Do you not have an account yet?{" "}
        <Link to={"/register"} className="text-secondary font-poppins-bold">
          Register Here
        </Link>
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-4/5 md:w-3/5 mt-8 mx-auto"
      >
        {errors.general && (
          <p className="error-msg flex items-center gap-2 bg-red-300 text-red-500 text-xs rounded-md p-2 ">
            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
            <span>{errors.general}</span>
          </p>
        )}
        <div className="form-control grid gap-2">
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Enter email"
            value={formData.email.trim()}
            onChange={handleChange}
            className={`${formFieldClasses} ${
              errors.email ? "border-2 border-red" : "border border-shadow"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-poppins-medium text-left">
              {errors.email}
            </p>
          )}
        </div>
        <div className="form-control grid gap-2">
          <input
            type="text"
            name="password"
            id="password"
            placeholder="Enter password"
            value={formData.password.trim()}
            onChange={handleChange}
            className={`${formFieldClasses} ${
              errors.password ? "border-2 border-red" : "border border-shadow"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs font-poppins-medium text-left">
              {errors.password}
            </p>
          )}
        </div>
        <div className="form-control text-left text-secondary">
          <button type="button" className="flex gap-2 text-sm">
            <input type="checkbox" name="remember" id="remember" />
            <span>remember me on next login</span>
          </button>
        </div>
        <button className="bg-white text-center text-primary text-sm box-shadow-1 font-poppins-bold rounded-full px-6 py-4 mt-4">
          <span>Login</span>
        </button>
      </form>
    </div>
  );
};

export default Login;
