import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  classNames?: string;
  text: string;
}

const ActionButton: React.FC<ButtonProps> = ({
  classNames,
  text,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`${classNames} block box-shadow-1 font-poppins-bold px-4 py-2 text-sm mt-8 ml-auto`}
    >
      {text}
    </button>
  );
};

export default ActionButton;
