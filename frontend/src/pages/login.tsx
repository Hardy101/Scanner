import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { icons } from "../constants/media";

interface FormData {
  email: string;
  password: string;
  errors?: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    errors: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/home");
  };
  const formFieldClasses =
    "bg-transparent text-secondary font-poppins placeholder:text-secondary border border-shadow text-xs px-4 py-3 rounded-md";

  const formFields = [
    {
      type: "email",
      id: "email",
      value: formData.email,
      placeholder: "Enter email",
      classNames: formFieldClasses,
    },
    {
      type: "password",
      id: "password",
      value: formData.password,
      placeholder: "Enter password",
      classNames: formFieldClasses,
    },
  ];

  return (
    <div className="min-h-screen bg-primary pt-16 flex flex-col gap-4 text-white text-center">
      <h2 className="text-2xl font-poppins-bold">Welcome back</h2>
      <p className="text-sm">
        Do you not have an account yet?{" "}
        <Link to={'/register'} className="text-secondary font-poppins-bold">Register Here</Link>
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-4/5 md:w-3/5 mt-8 mx-auto"
      >
        {formFields.map((input, idx) => (
          <input
            key={idx}
            type={input.type}
            id={input.id}
            name={input.id}
            value={input.value}
            onChange={handleChange}
            placeholder={input.placeholder}
            className={`${input.classNames}`}
          />
        ))}
        <button className="bg-white text-center text-primary text-sm box-shadow-1 font-poppins-bold rounded-full px-6 py-4 mt-4">
          <span>Login</span>
        </button>
      </form>
    </div>
  );
};

export default Login;
