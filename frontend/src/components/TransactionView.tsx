"use client";

import { useEffect, useState } from "react";
import type { Transaction } from "../lib/mock-data";
import axi from "../utils/axios_cofig";

interface TransactionsViewProps {
  transactions: Transaction[];
}

export default function TransactionsView({
  selectedPeriod,
  selectedAccount,
}: TransactionsViewProps) {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchTransactions = async (month, accountId) => {
    setLoading(true);
    try {
      const res = await axi.post(
        "/user/transactions",
        {
          month: month,
          accountId: accountId,
        },
        {
          withCredentials: true,
        }
      );
      setTransactions(res.data);
      console.log("Fetched Transactions:", res.data);
      // setTransactions(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setLoading(false);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(selectedPeriod, selectedAccount.account_id);
  }, [selectedPeriod, selectedAccount]);

  //   const filteredTransactions = transactions.filter((transaction) => {
  //     if (filter === "income") return transaction.amount > 0;
  //     if (filter === "expense") return transaction.amount < 0;
  //     return true;
  //   });
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg
          className="animate-spin h-8 w-8 text-blue-500 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        <span className="text-gray-600 text-lg">Loading transactions...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
          <div className="flex space-x-6 items-center">
            <span className="text-sm text-green-700 font-medium">
              Income: $
              {transactions
                .filter((t) => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                .toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-sm text-red-700 font-medium">
              Expense: $
              {transactions
                .filter((t) => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("income")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                filter === "income"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilter("expense")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                filter === "expense"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Expenses
            </button>
          </div>
        </div>
      </div>
      <div className="max-h-96 sm:max-h-[500px] overflow-y-auto">
        {(() => {
          const filteredTransactions = transactions.filter((transaction) => {
            if (filter === "income") return transaction.amount < 0;
            if (filter === "expense") return transaction.amount > 0;
            return true;
          });
          if (filteredTransactions.length === 0) {
            return (
              <div className="flex items-center justify-center py-12 text-gray-500">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>No transactions found for the selected filter.</p>
                </div>
              </div>
            );
          }
          return (
            <div className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.transaction_id}
                  className="px-4 sm:px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                          {transaction.name || transaction.merchant_name}
                        </h4>
                        {/* Pending status not available in provided data */}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {(() => {
                            try {
                              const cat = JSON.parse(
                                transaction.personal_finance_category || "{}"
                              );
                              return cat.primary || "";
                            } catch {
                              return "";
                            }
                          })()}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {transaction.datetime
                            ? new Date(
                                transaction.datetime
                              ).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`text-lg sm:text-xl font-semibold ${
                        transaction.amount <= 0
                          ? "text-green-600"
                          : "text-red-600"
                      } text-right`}
                    >
                      {transaction.amount < 0 ? "+" : ""}$
                      {Math.abs(transaction.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
