import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { useModalStore } from "../store/useModalStore";

interface ModalProps {
  children: ReactNode;
  classNames?: string;
}

const Modal: React.FC<ModalProps> = ({ children, classNames, ...props }) => {
  const { isModalActive } = useModalStore();

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (modalRef) {
        if (isModalActive) {
          gsap.fromTo(
            modalRef.current,
            {
              opacity: 0,
              scale: 0.7,
            },
            {
              opacity: 1,
              scale: 1,
              duration: 1,
              onStart: () => {
                if (modalRef.current)
                  modalRef.current.style.pointerEvents = "auto";
              },
              ease: "elastic.out(1, 0.4)",
            }
          );
        } else {
          gsap.to(modalRef.current, {
            opacity: 0,
            scale: 0.7,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
              if (modalRef.current)
                modalRef.current.style.pointerEvents = "none";
            },
          });
        }
      }
    }, modalRef);

    return () => ctx.revert();
  }, [isModalActive]);

  return (
    <div
      ref={modalRef}
      {...props}
      className={`${classNames} absolute top-15 left-10 w-5/6 bg-white rounded-xl p-4 opacity-0 z-4`}
    >
      {children}
    </div>
  );
};

export default Modal;
