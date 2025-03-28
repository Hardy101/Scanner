import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { icons } from "../constants/media";

interface FormData {
  name: string;
  email: string;
  password: string;
  errors?: string;
}

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    errors: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      valid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    if (formData.password.length < 8) {
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
      alert("Success!"), navigate("/home");
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
        className="flex flex-col gap-4 w-4/5 md:w-3/5 mt-8 mx-auto"
      >
        <p className="grid text-red-500 text-left text-sm">
          {errors.name && <span>{errors.name}</span>}
          {errors.email && <span>{errors.email}</span>}
          {errors.password && <span>{errors.password}</span>}
        </p>
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
