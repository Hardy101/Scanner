import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  classNames: string;
}

const Button: React.FC<ButtonProps> = ({ children, classNames }) => {
  return (
    <button className={`${classNames} font-bold rounded-full px-6 py-2`}>
      {children}
    </button>
  );
};

export default Button;
