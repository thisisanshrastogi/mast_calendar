import CountUp from "react-countup";
import { useState } from "react";
import type { Account } from "../lib/mock-data.js";
import TransactionsView from "../components/TransactionView.js";
import axi from "../utils/axios_cofig.js";
import RecurringView from "./RecurringView.js";
import { ArrowDown, ArrowUp, WalletIcon } from "lucide-react";
// import RecurringView from "@/components/recurring-view";

interface AccountDashboardProps {
  account: Account;
}

export default function AccountDashboard({ account }: AccountDashboardProps) {
  const [activeTab, setActiveTab] = useState("transactions");
  const [selectedPeriod, setSelectedPeriod] = useState("1");
  const [viewMode, setViewMode] = useState<"calendar" | "detailed">("calendar");

  const periodOptions = [
    { value: "1", label: "1M" },
    { value: "3", label: "3M" },
    { value: "6", label: "6M" },
    { value: "12", label: "1Y" },
  ];

  // Filter transactions based on selected period
  //   const filteredTransactions = account.transactions.filter((transaction) => {
  //     const now = new Date();
  //     const startDate = new Date();
  //     const transactionDate = new Date(transaction.date);

  //     switch (selectedPeriod) {
  //       case "1month":
  //         startDate.setMonth(now.getMonth() - 1);
  //         break;
  //       case "6months":
  //         startDate.setMonth(now.getMonth() - 6);
  //         break;
  //       case "1year":
  //         startDate.setFullYear(now.getFullYear() - 1);
  //         break;
  //     }

  //     return transactionDate >= startDate;
  //   });

  //   // Calculate monthly stats
  //   const monthlyIncome = filteredTransactions
  //     .filter((t) => t.amount > 0)
  //     .reduce((sum, t) => sum + t.amount, 0);

  //   const monthlyExpenses = filteredTransactions
  //     .filter((t) => t.amount < 0)
  //     .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  //   const pendingTransactions = account.transactions.filter((t) => t.isPending);
  //   const pendingAmount = pendingTransactions.reduce(
  //     (sum, t) => sum + t.amount,
  //     0
  //   );

  {
    /* Summary Cards */
  }
  {
    /* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
            Income
          </h3>
          <p className="text-lg sm:text-xl font-bold text-green-600">
            $
            {monthlyIncome.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
            Expenses
          </h3>
          <p className="text-lg sm:text-xl font-bold text-red-600">
            $
            {monthlyExpenses.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
            Pending
          </h3>
          <p className="text-lg sm:text-xl font-bold text-blue-600">
            $
            {Math.abs(pendingAmount).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
            <span className="text-xs ml-1">({pendingTransactions.length})</span>
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
            Recurring
          </h3>
          <p className="text-lg sm:text-xl font-bold text-purple-600">
            $
            {account.recurringTransactions
              .reduce((sum, bill) => sum + bill.amount, 0)
              .toLocaleString("en-US", { minimumFractionDigits: 2 })}
            <span className="text-xs ml-1">
              ({account.recurringTransactions.length})
            </span>
          </p>
        </div>
      </div> */
  }
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Account Header */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Account Header Card */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Current Balance */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Current Balance
              </h3>
              <div className="p-2 bg-blue-50 rounded-full">
                <WalletIcon className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div
              className={`text-2xl font-bold ${
                account.balance_current >= 0
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              $
              {Math.abs(account.balance_current).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
              {account.balance_current < 0 && (
                <span className="text-xs ml-1 font-normal">Owed</span>
              )}
            </div>
          </div>

          {/* Estimated Recurring Inflow */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Est. Recurring Inflow
              </h3>
              <div className="p-2 bg-green-50 rounded-full">
                <ArrowDown className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              <CountUp
                start={0}
                end={50}
                duration={2}
                separator=","
                decimals={2}
                prefix="$"
              />
              {/* Replace with dynamic calculation if available */}
            </div>
          </div>

          {/* Estimated Recurring Outflow */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Est. Recurring Outflow
              </h3>
              <div className="p-2 bg-red-50 rounded-full">
                <ArrowUp className="w-5 h-5 text-rose-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-rose-600">
              <CountUp
                start={0}
                end={20}
                duration={2}
                separator=","
                decimals={2}
                prefix="$"
              />
              {/* Replace with dynamic calculation if available */}
            </div>
          </div>
        </div>
        {/* Tab Navigation Card */}
        <div className="flex-1">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow h-full flex flex-col gap-4">
            {/* Tab Buttons */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("transactions")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "transactions"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab("recurring")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "recurring"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Recurring Bills
              </button>
            </div>

            {/* Period Options (only for Transactions tab) */}
            {activeTab === "transactions" && (
              <div className="flex bg-gray-100 rounded-lg p-1">
                {periodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedPeriod(option.value)}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      selectedPeriod === option.value
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            {activeTab === "recurring" && (
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === "calendar"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setViewMode("detailed")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === "detailed"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Detailed
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === "transactions" ? (
          <TransactionsView
            selectedPeriod={selectedPeriod}
            selectedAccount={account}
          />
        ) : (
          <RecurringView
            selectedAccount={account}
            viewMode={viewMode}
            recurringTransactions={account.recurringTransactions}
          />
        )}
      </div>
    </div>
  );
}
