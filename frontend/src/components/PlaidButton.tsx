import React, { useCallback, useEffect, useState } from "react";
import axi from "../utils/axios_cofig";
import { usePlaidLink } from "react-plaid-link";
import { useNavigate } from "react-router-dom";
import { Loader2, Shield, Zap } from "lucide-react";
import { toast } from "react-toastify";

interface PlaidButtonProps {
  setUser: (status: "connected" | null) => void;
}

const PlaidButton: React.FC<PlaidButtonProps> = ({ setUser }) => {
  const navi = useNavigate();

  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchLinkToken = async () => {
    setLoading(true);
    try {
      const res = await axi.post("/plaid/create_link_token");
      if (res.status === 250) {
        toast.warning(
          "Email already connected to Plaid, redirecting to home.",
          {
            autoClose: 3000,
            closeOnClick: true,
            className: "",
          }
        );
        setTimeout(() => {
          navi("/home");
        }, 3000);
      }
      setLinkToken(res.data.link_token);
    } catch (error) {
      navi("/login");
      console.error("Error creating link token:", error);
    }

    setLoading(false);
  };

  const onSuccess = useCallback(async (public_token: any, metadata: any) => {
    console.log("Public Token:", public_token);
    console.log("Metadata:", metadata);

    // Step 3: Send public_token to backend
    setLoading(true);
    try {
      const res = await axi.post("/plaid/exchange_public_token", {
        public_token,
      });

      if (res.status !== 200) {
        console.error("Error exchanging public token:", res.data);
        navi("/login");
        return;
      }
      setUser("connected");
      setLoading(false);
      navi("/home");

      console.log("Access Token Response:", res.data);
    } catch (error) {
      console.error("Error exchanging public token:", error);
      toast.error("Failed to connect bank account. Please try again.");
      navi("/login");
    } finally {
      setLoading(false);
      setLinkToken(null);
    }
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit: (err, metadata) => {
      setLoading(false);
      console.warn("Plaid exited:", err, metadata);
      setLinkToken(null);
    },
  });

  //   useEffect(() => {
  //     const createLinkToken = async () => {
  //       try {
  //         const res = await axi.post("/create_link_token");
  //         setLinkToken(res.data.link_token);
  //       } catch (error) {
  //         console.error("Error creating link token:", error);
  //       }
  //     };
  //     createLinkToken();
  //   }, []);

  return (
    <>
      <div className="">
        {!linkToken ? (
          <button
            type="button"
            onClick={fetchLinkToken}
            disabled={loading}
            className={`w-full h-14 px-6 py-3 text-lg font-semibold flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
              ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-700 hover:to-blue-700 shadow-md hover:shadow-lg hover:scale-[1.03] text-white"
              }`}
            tabIndex={0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Preparing Connection...
              </>
            ) : (
              <>
                <Zap className="mr-3 h-5 w-5" />
                Get Started
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => open()}
            disabled={!ready || loading}
            className={`w-full h-14 px-6 py-3 text-lg font-semibold flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              ready
                ? "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-lg hover:scale-[1.03] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            tabIndex={0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Preparing Connection...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-5 w-5" />
                Connect Your Bank
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default PlaidButton;
