import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  classNames?: string;
  text: string;
  icon?: string;
}

const ActionButton: React.FC<ButtonProps> = ({
  classNames,
  text,
  icon,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`${classNames} flex items-center gap-2 box-shadow-1 px-4 py-2 text-xs`}
    >
      <i className={icon}></i>
      {text}
    </button>
  );
};

export default ActionButton;
