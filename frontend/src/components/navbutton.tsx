interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  classNames?: string;
}

const NavButton: React.FC<ButtonProps> = ({ text, classNames, ...props }) => {
  return (
    <button
      {...props}
      className={`${classNames} bg-white text-primary text-sm font-bold rounded-md px-3 py-1 box-shadow-1`}
    >
      {text}
    </button>
  );
};

export default NavButton;
