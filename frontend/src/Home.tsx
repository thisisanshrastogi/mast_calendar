import { useEffect, useState } from "react";
import PlaidButton from "./components/PlaidButton";
import Transactions from "./components/TransactionList";
import RecurringTransactions from "./components/RecurringTransactions";
import Calendar from "./components/Calendar";
import axi from "./utils/axios_cofig";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import { useNavigate } from "react-router-dom";
import {
  Calendar1Icon,
  CalendarCheckIcon,
  CreditCard,
  LogOut,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import LoaderMessage from "./components/Loader2";

function Home() {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<"connected" | null>("connected");
  const [view, setView] = useState<"transactions" | "recurring" | "calendar">(
    "transactions"
  );
  const navi = useNavigate();

  const logout = async () => {
    try {
      await axi.post("/sessionLogout", {}, { withCredentials: true });
      navi("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigationItems = [
    {
      id: "transactions" as const,
      label: "Transactions",
      icon: CreditCard,
      description: "View all transactions",
    },
    {
      id: "recurring" as const,
      label: "Recurring",
      icon: RotateCcw,
      description: "Manage subscriptions",
    },
    {
      id: "calendar" as const,
      label: "Calendar",
      icon: Calendar1Icon,
      description: "Financial timeline",
    },
  ];

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
  }, []);

  // if (loading) {
  //   return (
  //     <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
  //       <Loader2 className="animate-spin h-12 w-12 text-teal-500" />
  //     </div>
  //   );
  // }
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col  items-center justify-center  selection:bg-teal-400 selection:text-white">
      <div className=" h-screen w-screen grid grid-cols-5">
        {/* sidebar */}
        <div className="col-span-1 bg-white border-r border-slate-200 flex flex-col shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
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
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Mast Calendar
                </h1>
              </div>
            </div>
            <div className="inline-flex items-center px-2.5 my-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
              <span className="h-2 w-2 bg-teal-500 rounded-full mr-2 inline-block" />
              Plaid Connected
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-6">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = view === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 group ${
                      isActive
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive
                          ? "text-teal-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="p-6 border-t border-slate-200">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-teal-700 transition-colors font-medium shadow-sm"
              type="button"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
        {/* <div className="col-span-1 bg-teal-100/60 p-4 h-full flex flex-col  ">
          <h2 className="text-3xl font-medium text-center">Mast Calendar</h2>
          <p className="text-green-500 text-center my-2">
            Plaid is connected successfully!
          </p>
          <div className="flex grow mb-4 flex-col items-center gap-4 justify-center px-4">
            <button
              className={`px-4 w-full rounded-lg py-2 hover:bg-teal-600 cursor-pointer hover:text-white ${
                view === "transactions"
                  ? "bg-teal-500 text-white"
                  : "bg-white border border-teal-500 text-teal-500"
              }`}
              onClick={() => setView("transactions")}
            >
              Transactions
            </button>
            <button
              className={`px-4 w-full py-2 rounded-lg transition-colors cursor-pointer hover:bg-teal-600 hover:text-white ${
                view === "recurring"
                  ? "bg-teal-500 text-white"
                  : "bg-white border border-teal-500 text-teal-500 "
              }`}
              onClick={() => setView("recurring")}
            >
              Recurring Transactions
            </button>
            <button
              className={`px-4 w-full py-2 rounded-lg hover:bg-teal-600 cursor-pointer hover:text-white ${
                view === "calendar"
                  ? "bg-teal-500 text-white"
                  : "bg-white border border-teal-500 text-teal-500"
              }`}
              onClick={() => setView("calendar")}
            >
              Calendar
            </button>
          </div>
          <button
            className="mt-auto w-full py-2 px-4 rounded-lg bg-teal-200 text-teal-700 hover:bg-teal-300 flex items-center justify-center gap-2 transition-colors"
            onClick={logout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              />
            </svg>
            Logout
          </button>
        </div> */}
        {loading ? (
          <div className="col-span-4 flex items-center justify-center ">
            <LoaderMessage />
          </div>
        ) : (
          <></>
        )}
        {!loading ? (
          <div className="col-span-4 overflow-auto">
            {view === "transactions" && <Transactions />}
            {view === "recurring" && <RecurringTransactions />}
            {view === "calendar" && <Calendar />}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Home;
