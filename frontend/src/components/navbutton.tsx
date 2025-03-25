interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  classNames?: string;
}

const NavButton: React.FC<ButtonProps> = ({ text, classNames, ...props }) => {
  return (
    <button
      {...props}
      className={`${classNames} group relative bg-white text-primary text-sm font-bold rounded-md px-3 py-1 box-shadow-1 hover:border-x hover:border-t hover:border-secondary-2 overflow-clip`}
    >
      <span className="absolute left-0 top-0 bg-primary w-0 h-full transition-all duration-300 group-hover:w-full z-1"></span>
      <span className="relative z-2 group-hover:text-white">{text}</span>
    </button>
  );
};

export default NavButton;
