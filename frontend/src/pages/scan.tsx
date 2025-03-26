import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Scan = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [errors, setErrors] = useState("");
  const errorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        setErrors(String(error));
        console.error("Error Processing camera", error);
      }
    };

    startCamera();

    if (errors) {
      gsap.to(errorRef.current, {
        x: () => gsap.utils.random(-5, 5),
        y: () => gsap.utils.random(-5, 5),
        repeat: 3,
        yoyo: true,
        duration: 0.05,
        ease: "power1.inOut",
      });
    } else {
      gsap.to(errorRef.current, { opacity: 0 });
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [errors]);

  return (
    <div className="min-h-screen grid bg-primary text-white md:p-8">
      <div className="relative h-full body bg-white">
        <p ref={errorRef} className="absolute w-full top-0 flex p-2">
          <span className="w-full text-center text-sm font-poppins bg-red px-2 py-1">
            The profile is either missing or invalid. Please check and try
            again.
          </span>
        </p>
        <video
          ref={videoRef}
          className="absolute w-full h-full top-0"
          autoPlay
          playsInline
        />
        <button className="absolute bottom-5 left-50 md:left-44 bg-white border-4 border-primary rounded-full p-2">
          <span className="block w-16 h-16 bg-primary rounded-full"></span>
        </button>
      </div>
    </div>
  );
};

export default Scan;
