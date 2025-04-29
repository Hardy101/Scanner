import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import jsQR from "jsqr";

const Scan = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [errors, setErrors] = useState("");
  const errorRef = useRef<HTMLDivElement | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        interval = setInterval(scanQRCode, 500);
      } catch (error) {
        setErrors(String(error));
        console.error("Error Processing camera", error);
      }
    };

    const scanQRCode = () => {
      if (scanned || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        console.log("QR Code Data:", code.data);
        setScanned(true);
        // 👉 You can now use code.data to make a backend call
        // Example: checkInGuest(code.data)
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
      clearInterval(interval);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [errors, scanned]);

  return (
    <div className="min-h-screen grid bg-primary text-white md:p-8">
      <div className="relative h-full body bg-white">
        <p ref={errorRef} className="absolute w-full top-0 flex p-2">
          <span className="w-full text-center text-sm font-poppins bg-red px-2 py-1">
            {errors || "Scan a QR code to check in"}
          </span>
        </p>
        <video
          ref={videoRef}
          className="absolute w-full h-full top-0"
          autoPlay
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />
        <button className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white border-4 border-primary rounded-full p-2">
          <span className="block w-16 h-16 bg-primary rounded-full"></span>
        </button>
      </div>
    </div>
  );
};

export default Scan;
