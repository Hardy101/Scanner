import Portal from "./portal";

const ToastNotification = ({
  onClose,
  text,
}: {
  onClose: () => void;
  text: string;
}) => {
  return (
    <Portal>
      <div className="fixed top-8 left-0 w-full h-full bg-opacity-50 z-50">
        <div className="bg-secondary w-2/5 p-4 rounded shadow-lg flex justify-between gap-4 mx-auto font-poppins">
          <h2>{text}</h2>
          <button onClick={onClose} className="text-xs">Close</button>
        </div>
      </div>
    </Portal>
  );
};

export default ToastNotification;
