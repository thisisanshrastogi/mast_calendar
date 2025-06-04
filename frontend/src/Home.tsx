import { useEffect, useState } from "react";
import PlaidButton from "./components/PlaidButton";
import Transactions from "./components/TransactionList";
import RecurringTransactions from "./components/RecurringTransactions";
import Calendar from "./components/Calendar";
import axi from "./utils/axios_cofig";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import { useNavigate } from "react-router-dom";
import { Loader2, Menu, X } from "lucide-react"; // adjust import if needed

import {
  Calendar1Icon,
  CalendarCheckIcon,
  CreditCard,
  LogOut,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import LoaderMessage from "./components/Loader2";
import BillManagement from "./components/RecurringView";
import type { Account } from "./lib/mock-data";
import AccountSelector from "./components/AccountSelector";
import AccountDashboard from "./components/AccountDashboard";
import { toast } from "react-toastify";
import FeedbackPopup from "./components/FeedbackPopup";

function Home() {
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const navi = useNavigate();

  const logout = async () => {
    try {
      const response = await axi.post(
        "/sessionLogout",
        {},
        { withCredentials: true }
      );
      toast.done("Logout successful!");
      navi("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        console.log("Chekcing user status...");
        const res = await axi.get("/user/status", { withCredentials: true });
        console.log(res.data);
        if (res.data?.status === "ready") {
          setLoading(false);
        } else {
          setTimeout(() => {
            checkStatus();
          }, 6000);
        }
      } catch {
        setLoading(true);
      }
    };

    checkStatus();
  }, [selectedAccount]);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <LoaderMessage />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm  sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Mast Calendar
              </h1>
            </div>
            {selectedAccount && (
              <div className="flex items-center space-x-4">
                {/* Card Mask */}
                <div className="bg-white shadow rounded px-4 py-2 flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">
                    Account:
                  </span>
                  <span className="tracking-widest text-gray-900">
                    **** **** **** {selectedAccount.mask || "••••"}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Change Account
                </button>
                <button
                  onClick={logout}
                  className="flex items-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {selectedAccount ? (
          <AccountDashboard account={selectedAccount} />
        ) : (
          <AccountSelector onSelectAccount={setSelectedAccount} />
        )}
      </main>
      {/* {feedback} */}
      <FeedbackPopup />
    </div>
  );
}

export default Home;
