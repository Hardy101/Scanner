interface ButtonProps {
  text: string;
  classNames: string;
}

const NavButton: React.FC<ButtonProps> = ({ text, classNames, ...props }) => {
  return (
    <button {...props} className={`${classNames} font-bold rounded-md p-2`}>
      {text}
    </button>
  );
};

export default NavButton;
