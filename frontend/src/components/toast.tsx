import Portal from "./portal";
import { useToastStore } from "../store/useToastStore";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const ToastNotification = () => {
  const { isToastActive, setIsToastActive, text, subtext } = useToastStore();
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isToastActive && toastRef.current) {
      // Pop-up animation
      gsap.fromTo(
        toastRef.current,
        { y: 100, opacity: 0, scale: 0.4 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [isToastActive]);

  if (!isToastActive) return null; // Don't render if the toast is not active
  // This component is only rendered when the toast is active
  return (
    <Portal>
      <div
        ref={toastRef}
        className="fixed top-8 left-0 w-full md:pr-10 bg-opacity-50 z-50"
      >
        <div className="bg-white w-4/5 md:w-2/5 p-4 rounded shadow-lg flex items-center justify-between gap-4 text-primary mx-auto md:ml-auto">
          <i className="fa-solid fa-check font-bold mt-1 p-1 rounded-full border-2 border-primary text-xs mb-auto"></i>
          <p className="grow grid">
            <span className="font-poppins-medium">{text}</span>
            <span className="font-poppins text-sm">{subtext}</span>
          </p>
          <button
            onClick={() => setIsToastActive(false)}
            className="text-xs hover:text-red font-poppins-bold"
          >
            Close
          </button>
        </div>
      </div>
    </Portal>
  );
};

export default ToastNotification;
