import { useState } from "react";
import { useNavigate } from "react-router";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/");
  };
  const formFieldClasses =
    "bg-white text-primary font-poppins-medium placeholder:text-primary text-sm px-4 py-2 rounded-full";

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
        <span className="text-secondary-2 font-bold">Login</span>
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

      
        <button className="bg-white text-center text-primary text-sm box-shadow-1 font-poppins-bold rounded-full px-6 py-2 mt-4">
          <span>Register</span>
        </button>
      </form>
    </div>
  );
};

export default Register;
