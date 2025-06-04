import React, { useState, useEffect } from "react";
import { X, ThumbsUp, ThumbsDown, Phone, CheckCircle } from "lucide-react";
import axi from "../utils/axios_cofig";

export default function FeedbackPopup() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<"thumb" | "phone" | "done">("thumb");
  const [thumb, setThumb] = useState<"up" | "down" | null>(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const submitFeedback = async () => {
    try {
      console.log("Submitting feedback...");
      const response = await axi.post(
        "/user/feedback",
        {
          rating: thumb,
          phone: phone,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Feedback submitted:", response.data);
      setVisible(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("Failed to submit feedback. Please try again later.");
    }
  };

  useEffect(() => {
    const getFeedbackStatus = async () => {
      try {
        console.log("Fetching feedback status...");
        const response = await axi.get("/user/feedback_status", {
          withCredentials: true,
        });
        if (response.status === 250) {
          setTimeout(() => {
            setVisible(true);
            getFeedbackStatus();
          }, 15000);
        }
        console.log(response.status);
      } catch (error) {
        console.error("Error fetching feedback status:", error);
      }
    };
    getFeedbackStatus();
    // return () => clearTimeout(timer);
  }, []);

  const handleThumb = (value: "up" | "down") => {
    setThumb(value);
    setStep("phone");
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim() === "") {
      submitFeedback();
    }
    if (!/^\d{10,15}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    setStep("done");
    // Submit feedback here if needed
  };
  if (!visible) return null;

  return (
    <div className="fixed bottom-0 right-0 md:bottom-5 md:right-5 w-full md:w-1/3 bg-gradient-to-r from-blue-50 to-white shadow-2xl border-t border-blue-100 rounded-3xl p-5 z-50 transform transition-all duration-300 ease-out animate-slide-up">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h4 className="text-lg font-bold text-gray-800">Give Feedback</h4>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setStep("thumb");
              setThumb(null);
              setPhone("");
              setError("");
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            aria-label="Close feedback"
          >
            <X size={18} />
          </button>
        </div>

        {step === "thumb" && (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-gray-700 text-center font-medium">
              How was your experience?
            </p>
            <div className="flex gap-4">
              <button
                aria-label="Thumbs up"
                onClick={() => handleThumb("up")}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                <div className="p-2.5 bg-blue-200 group-hover:bg-blue-100 rounded-full transition-colors duration-200">
                  <ThumbsUp size={20} className="text-gray-600" />
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-700">
                  Good
                </span>
              </button>
              <button
                aria-label="Thumbs down"
                onClick={() => handleThumb("down")}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-red-50 transition-all duration-200 hover:scale-105"
              >
                <div className="p-2.5 bg-red-100 group-hover:bg-red-200 rounded-full transition-colors duration-200">
                  <ThumbsDown size={20} className="text-red-600" />
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-red-700">
                  Poor
                </span>
              </button>
            </div>
          </div>
        )}

        {step === "phone" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone size={20} className="text-blue-600" />
              </div>
            </div>
            <p className="text-gray-700 text-center font-medium mb-4">
              Help us serve you better
            </p>
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-200 text-gray-700 placeholder-gray-400"
                  placeholder="Enter your phone number"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Phone size={16} className="text-gray-400" />
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        )}

        {step === "done" && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800">Thank you!</h3>
              <p className="text-gray-600">
                Your feedback helps us improve our service
              </p>
            </div>
            <div className="flex justify-center">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
