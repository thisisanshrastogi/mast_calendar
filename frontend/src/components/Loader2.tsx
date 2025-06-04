import { useEffect, useState } from "react";

const messages = [
  "Getting things ready...",
  "Almost there...",
  "Just a moment...",
  "Setting things up...",
];

export default function LoaderMessage({ customMessage }) {
  const [index, setIndex] = useState(0);
  const messagesToShow = customMessage ? [customMessage] : messages;
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); // change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-gray-800">
      <div className="honeycomb ">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div
        key={index}
        className="text-xl text-slate-800 mt-12 font-medium transition-opacity duration-500 ease-in-out"
        style={{ opacity: 1, animation: "fadeInOut 2s linear" }}
      >
        {messagesToShow[index]}
      </div>
      <style>
        {`
        @keyframes fadeInOut {
        0% { opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { opacity: 0; }
        }
      `}
      </style>
    </div>
  );
}
