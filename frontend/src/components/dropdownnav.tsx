import { useEffect, useRef } from "react";
import gsap from "gsap";

import Hr from "./hr";

import { useDropdownState } from "../store/useDropdownStore";
import { useModalState } from "../store/useModalStore";
import { Link } from "react-router";

const DropdownNav: React.FC = () => {
  const dropdownref = useRef<HTMLDivElement | null>(null);
  const { isDropdownActive, setIsDropdownActive } = useDropdownState();
  const { setIsModalActive } = useModalState();

  useEffect(() => {
    if (!dropdownref.current) return;

    const ctx = gsap.context(() => {
      // Dropdown animation
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
    }, dropdownref);

    return () => ctx.revert();
  }, [isDropdownActive]);

  return (
    <div
      ref={dropdownref}
      className="w-5/6 absolute top-15 left-9 md:left-10 bg-[#225050] rounded-xl px-4 pt-10 pb-2 z-4 opacity-0"
    >
      <button
        onClick={() => setIsDropdownActive(false)}
        className="absolute flex bg-shadow text-secondary rounded-md p-1 text-xl right-4 top-4"
      >
        <i className="lni lni-xmark"></i>
      </button>
      <ul className="text-secondary leading-7">
        <li className="hover:text-white">
          <Link to={"/profile"}>
            <span>Profile</span>
          </Link>
        </li>
        <li className="hover:text-white">
          <span>Analytics</span>
        </li>
      </ul>
      <div>
        <Hr />
        <button
          onClick={() => setIsModalActive(true)}
          className="w-full bg-shadow border border-shadow-2 rounded-full py-2 text-xs mt-4 font-poppins-bold"
        >
          Add Event
        </button>
      </div>
    </div>
  );
};

export default DropdownNav;
