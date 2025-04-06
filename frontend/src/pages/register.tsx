import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

interface FormData {
  name: string;
  email: string;
  password: string;
}

// const urlLocal = "http://127.0.0.1:8000";
// export const url = "https://scanner-ohvw.onrender.com";
// export const url = "https://scanner-production-4af4.up.railway.app";
export const url = "http://127.0.0.1:8000";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    name: string;
    email: string;
    password: string;
    general: string;
  }>({
    name: "",
    email: "",
    password: "",
    general: "",
  });

  const validateForm = () => {
    let valid = true;
    let newErrors = { name: "", email: "", password: "", general: "" };

    if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
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
      const response = axios.post(`${url}/auth/register`, formData);
      response
        .then(
          (res) => (
            console.log(res.data),
            alert(`Success! User created successfully`),
            navigate("/login")
          )
        )
        .catch(
          (err) => (
            setErrors((prev) => ({
              ...prev,
              general:
                err.response.data.detail ||
                "Something went wrong, please fill the form again",
            })),
            console.log(errors)
          )
        );
    }
  };
  const formFieldClasses =
    "block w-full bg-transparent text-secondary font-poppins placeholder:text-secondary text-xs px-4 py-3 rounded-md focus:border-transparent";

  return (
    <div className="min-h-screen bg-primary py-16 flex flex-col gap-4 text-white text-center">
      <h2 className="text-2xl font-poppins-medium">Welcome to</h2>
      {/* <img
        src={icons.logo}
        alt="Logo"
        className="w-1/6 mx-auto"
        style={{
          pointerEvents: "none",
        }}
      /> */}
      <h1 className="text-4xl font-poppins-bold">INVIX</h1>
      <p className="text-sm">
        Already have an account?{" "}
        <Link to={"/login"} className="text-secondary font-poppins-bold">
          Login
        </Link>
      </p>
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 w-4/5 md:w-3/5 mx-auto"
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
            name="name"
            id="name"
            placeholder="Enter name"
            value={formData.name.trim()}
            onChange={handleChange}
            className={`${formFieldClasses} ${
              errors.name ? "border-2 border-red" : " border border-shadow"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs font-poppins-medium text-left">
              {errors.name}
            </p>
          )}
        </div>
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
        <button className="bg-white text-center text-primary text-sm box-shadow-1 font-poppins-bold rounded-full px-6 py-4 mt-4">
          <span>Register</span>
        </button>
      </form>
    </div>
  );
};

export default Register;
