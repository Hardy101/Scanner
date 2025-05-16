import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

import { useToastStore } from "../store/useToastStore";
import { url } from "../constants/variables";
import { icons } from "../constants/media";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();

  const { setIsToastActive, setText } = useToastStore();
  const [focusedFields, setFocusedFields] = useState({
    name: false,
    email: false,
    password: false,
  });
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
          () => (
            setIsToastActive(true),
            setText("Registration successful!"),
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
    "block w-full bg-white font-ibmplex-bold placeholder:text-black placeholder:font-ibmplex text-sm p-5 focus:outline-primary";

  return (
    <section className="relative min-h-screen py-16 flex flex-col gap-4 text-center">
      <img
        src={icons.floatingqrcode}
        alt="floating image of qrcode"
        className="w-3/4 absolute right-0 top-0"
      />
      <div className="md:w-2/5 px-8 md:mx-auto mt-auto z-10">
        <h1 className="relative flex gap-4 items-center">
          <img src={icons.logo} alt="logo of invix" className="w-32" />
          <span className="text-5xl font-dmserif">Get Started</span>
        </h1>
        <form onSubmit={handleSubmit} className="grid gap-8 mt-12 mx-auto">
          {errors.general && (
            <p className="error-msg flex items-center gap-2 text-red-500 text-sm rounded-md p-2 font-ibmplex-bold">
              <i className="fa-solid fa-triangle-exclamation text-lg"></i>
              <span>{errors.general}</span>
            </p>
          )}
          {/* === NAME FIELD === */}
          <div className="relative form-control grid gap-2">
            <p
              style={{ pointerEvents: "none" }}
              className={`absolute left-2 flex items-center font-ibmplex-bold gap-2 pr-2 text-[0.8rem] transition-all duration-200 ease-in-out bg-white ${
                focusedFields.name || formData.name.trim()
                  ? "-top-5 text-black"
                  : "top-1/2 left-15 -translate-x-1/2 -translate-y-1/2 text-gray-1"
              }`}
            >
              <span className="inline-flex text-white bg-black rounded-full p-[0.4rem]">
                <i className="fa-solid fa-user text-[0.7rem]"></i>
              </span>
              <label htmlFor="name">Name</label>
            </p>

            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedFields((f) => ({ ...f, name: true }))}
              onBlur={() => setFocusedFields((f) => ({ ...f, name: false }))}
              className={`${formFieldClasses} ${
                errors.name ? "border-2 border-red" : " border border-shadow"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs font-ibmplex-medium text-left">
                {errors.name}
              </p>
            )}
          </div>
          {/* === END OF NAME FIELD === */}

          {/* === EMAIL FIELD === */}
          <div className="relative form-control grid gap-2">
            <p
              style={{ pointerEvents: "none" }}
              className={` absolute left-2 flex items-center font-ibmplex-bold gap-2 pr-2 text-[0.8rem] transition-all duration-200 ease-in-out bg-white ${
                focusedFields.email || formData.email.trim()
                  ? "-top-5 text-black"
                  : "top-1/2 left-15 -translate-x-1/2 -translate-y-1/2 text-gray-1"
              }`}
            >
              <span className="inline-flex text-white bg-black rounded-full p-[0.4rem]">
                <i className="fa-solid fa-user text-[0.7rem]"></i>
              </span>
              <label htmlFor="email">Email</label>
            </p>
            <input
              type="text"
              name="email"
              id="email"
              value={formData.email.toLowerCase().trim()}
              onChange={handleChange}
              onFocus={() => setFocusedFields((f) => ({ ...f, email: true }))}
              onBlur={() => setFocusedFields((f) => ({ ...f, email: false }))}
              className={`${formFieldClasses} ${
                errors.email ? "border-2 border-red" : "border border-shadow"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-ibmplex-medium text-left">
                {errors.email}
              </p>
            )}
          </div>
          {/* === END OF EMAIL FIELD === */}

          {/* === PASSWORD FIELD === */}
          <div className="relative form-control grid gap-2">
            <p
              style={{ pointerEvents: "none" }}
              className={`absolute left-2 flex items-center font-ibmplex-bold gap-2 pr-2 text-[0.8rem] transition-all duration-200 ease-in-out bg-white ${
                focusedFields.password || formData.password.trim()
                  ? "-top-5 text-black"
                  : "top-1/2 left-18 -translate-x-1/2 -translate-y-1/2 text-gray-1"
              }`}
            >
              <span className="inline-flex text-white bg-black rounded-full p-[0.4rem]">
                <i className="fa-solid fa-key text-[0.7rem]"></i>
              </span>
              <label htmlFor="password">Password</label>
            </p>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password.trim()}
              onChange={handleChange}
              onFocus={() =>
                setFocusedFields((f) => ({ ...f, password: true }))
              }
              onBlur={() =>
                setFocusedFields((f) => ({ ...f, password: false }))
              }
              className={`${formFieldClasses} ${
                errors.password ? "border-2 border-red" : "border border-shadow"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs font-ibmplex-medium text-left">
                {errors.password}
              </p>
            )}
          </div>
          {/* === END OF PASSWORD FIELD === */}

          <button className="flex items-center text-center font-ibmplex-bold mt-4">
            <hr className="grow border border-gray-2" />
            <span className="px-6">Register</span>
            <span className="relative bg-primary py-6 px-6 rounded-r-full">
              <i className="fa-solid fa-arrow-right absolute text-2xl text-white left-0 top-1/2 -translate-y-1/2"></i>
            </span>
          </button>
          <div className="font-ibmplex">
            I already have an account.{" "}
            <Link to={"/login"} className="text-primary font-ibmplex-bold">
              Login
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
