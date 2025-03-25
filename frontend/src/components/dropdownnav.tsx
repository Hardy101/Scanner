import { useEffect, useRef } from "react";
import gsap from "gsap";

import Hr from "./hr";

import { useDropdownState } from "../store/useDropdownStore";

const DropdownNav: React.FC = () => {
  const dropdownref = useRef<HTMLDivElement | null>(null);
  const { isDropdownActive, setIsDropdownActive } = useDropdownState();

  useEffect(() => {
    if (dropdownref) {
      if (isDropdownActive) {
        gsap.fromTo(
          dropdownref.current,
          { opacity: 0, y: 20, scale: 0.95, rotateX: -10 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.5,
            ease: "power2.out",
            pointerEvents: "auto",
          }
        );
      } else {
        gsap.to(dropdownref.current, {
          opacity: 0,
          y: 20,
          scale: 0.95,
          rotateX: -10,
          pointerEvents: "none",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  }, [isDropdownActive]);

  return (
    <div
      ref={dropdownref}
      className="w-5/6 absolute top-15 left-10 bg-[#225050] rounded-xl px-4 pt-10 pb-2 z-2"
    >
      <button
        onClick={() => setIsDropdownActive(false)}
        className="absolute flex bg-shadow text-secondary rounded-md p-1 text-xl right-4 top-4"
      >
        <i className="lni lni-xmark"></i>
      </button>
      <ul className="text-sm text-secondary ">
        <li className="hover:text-white">
          <span>Profile</span>
        </li>
        <li className="hover:text-white">
          <span>Analytics</span>
        </li>
      </ul>
      <div>
        <Hr />
        <button>Add Event</button>
      </div>
    </div>
  );
};

export default DropdownNav;
