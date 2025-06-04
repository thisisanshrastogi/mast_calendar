import { useEffect, useState } from "react";

import axi from "./utils/axios_cofig";

import { useNavigate } from "react-router-dom";

import { LogOut } from "lucide-react";
import LoaderMessage from "./components/Loader2";
import type { Account, RecurringFlowState } from "./lib/interfaces";
import AccountSelector from "./components/AccountSelector";
import AccountDashboard from "./components/AccountDashboard";
import { toast } from "react-toastify";
import FeedbackPopup from "./components/FeedbackPopup";
import ConfirmDialog from "./components/Dialogue";

function Home() {
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [recurringFlow, setRecurringFlow] = useState<RecurringFlowState | null>(
    null
  );

  const [showDialog, setShowDialog] = useState(false);
  const handleOpen = () => setShowDialog(true);
  const handleCancel = () => setShowDialog(false);
  const handleConfirm = () => {
    toast.success("Logged Out Successfully!");
    setShowDialog(false);
    logout();
  };

  const navi = useNavigate();

  const logout = async () => {
    try {
      await axi.post("/sessionLogout", {}, { withCredentials: true });
      toast.done("Logout successful!");
      navi("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getRecurringFlow = async () => {
    if (selectedAccount === null) {
      setRecurringFlow(null);
      return;
    }
    try {
      const response = await axi.post(
        "/user/recurring_flows",
        {
          accountId: selectedAccount?.account_id,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Fetched Recurring Transactions:", response.data);
      setRecurringFlow(response.data);
    } catch (error) {
      console.error("Failed to fetch recurring transactions:", error);
      setRecurringFlow(null);
      return [];
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
    getRecurringFlow();
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
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between  items-center h-16">
            <div className="flex items-center gap-2  ">
              <h1 className="text-xl sm:text-2xl  font-bold text-gray-900">
                Mast Calendar
              </h1>
            </div>
            {selectedAccount && (
              <div className="flex items-center space-x-4">
                {/* Card Mask */}
                <div
                  className="bg-white shadow rounded px-4 py-2 flex items-center cursor-pointer"
                  onClick={() => setSelectedAccount(null)}
                >
                  <span className="font-semibold text-gray-700 mr-2">
                    Account:
                  </span>
                  <span className="tracking-widest text-gray-900">
                    **** **** **** {selectedAccount.mask || "••••"}
                  </span>
                </div>
                {/* <button
                  onClick={() => setSelectedAccount(null)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Change Account
                </button> */}
                <button
                  onClick={handleOpen}
                  className="flex items-center px-3 py-2 hover:bg-red-100 text-red-600 rounded transition"
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
          <AccountDashboard
            account={selectedAccount}
            recurringFlow={recurringFlow}
          />
        ) : (
          <AccountSelector onSelectAccount={setSelectedAccount} />
        )}
      </main>
      {/* {feedback} */}
      <FeedbackPopup />
      <ConfirmDialog
        open={showDialog}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default Home;
