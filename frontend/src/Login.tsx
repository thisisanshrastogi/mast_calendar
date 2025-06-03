import React from "react";
import axi from "./utils/axios_cofig";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navi = useNavigate();

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      console.log("ID Token:", idToken);

      const response = await axi.post(
        "/sessionLogin",
        { firebaseToken: idToken },
        { withCredentials: true }
      );
      console.log("Status code", response.status);

      if (response.status === 210) {
        navi("/plaid_link");
      }
      if (response.status === 200) {
        navi("/home");
      }

      // window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const trial = async () => {
    try {
      const response = await axi.post("/events", { withCredentials: true });
      console.log("response:", response);

      navi("/home");
      console.log("Trial response:", response.data);
    } catch (error) {
      console.error("Trial request failed:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to Mast Calendar
            </h1>
            <p className="text-gray-600">
              Start managing your expenses effortlessly
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-teal-4`00 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-semibold text-lg group-hover:text-gray-900 transition-colors">
              Sign-in / Login Securely with Google
            </span>
          </button>

          {/* Info Text */}
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>
              New to Mast Calendar? Your account will be created automatically.
            </p>
            <p>
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="text-teal-600 hover:text-teal-700 underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-teal-600 hover:text-teal-700 underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-sm text-gray-600 font-medium">
              Secured by Google
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
