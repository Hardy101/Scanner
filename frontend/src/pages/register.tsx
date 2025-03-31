import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

import { icons } from "../constants/media";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const url = "http://127.0.0.1:8000";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    let valid = true;
    let newErrors = "";

    if (formData.name.trim().length < 3) {
      newErrors = "Name must be at least 3 characters";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors = "Enter a valid email address";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors = "Password must be at least 8 characters";
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
            alert(`Success! ${JSON.stringify(res.data)}`),
            navigate("/home")
          )
        )
        .catch(
          (err) => (setErrors(err.response.data.detail), console.log(errors))
        );
    }
  };
  const formFieldClasses =
    "bg-transparent text-secondary font-poppins placeholder:text-secondary border border-shadow text-xs px-4 py-3 rounded-md";

  const formFields = [
    {
      type: "text",
      id: "name",
      value: formData.name,
      placeholder: "Name",
      classNames: formFieldClasses,
    },
    {
      type: "email",
      id: "email",
      value: formData.email,
      placeholder: "Email",
      classNames: formFieldClasses,
    },
    {
      type: "password",
      id: "password",
      value: formData.password,
      placeholder: "Password. Atleast 8 chars long",
      classNames: formFieldClasses,
    },
  ];

  return (
    <div className="min-h-screen bg-primary py-16 flex flex-col gap-4 text-white text-center">
      <h2 className="text-2xl font-poppins-bold">Welcome to</h2>
      <img
        src={icons.logo}
        alt="Logo"
        className="w-1/5 mx-auto"
        style={{
          pointerEvents: "none",
        }}
      />
      <p className="text-sm">
        Already have an account?{" "}
        <Link to={"/login"} className="text-secondary font-poppins-bold">
          Login
        </Link>
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-4/5 md:w-3/5 mx-auto"
      >
        {errors && (
          <p className="grid text-red-500 text-left text-sm"> {errors}</p>
        )}
        {formFields.map((input, idx) => (
          <input
            key={idx}
            type={input.type}
            id={input.id}
            name={input.id}
            value={input.value.trim()}
            onChange={handleChange}
            placeholder={input.placeholder}
            className={`${input.classNames}`}
          />
        ))}
        <button className="bg-white text-center text-primary text-sm box-shadow-1 font-poppins-bold rounded-full px-6 py-4 mt-4">
          <span>Register</span>
        </button>
      </form>
    </div>
  );
};

export default Register;
