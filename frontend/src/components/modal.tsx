import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children, ...props }) => {
  return (
    <div {...props} className="absolute top-15 w-2/6 bg-white rounded-xl p-4">
      {children}
    </div>
  );
};

export default Modal;
