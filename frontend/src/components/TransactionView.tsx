"use client";

import { useEffect, useState } from "react";
import type { Account, Transaction } from "../lib/interfaces";
import axi from "../utils/axios_cofig";
import { ReceiptIcon, TrendingDown, TrendingUp } from "lucide-react";
import CountUp from "react-countup";

export default function TransactionsView({
  selectedPeriod,
  selectedAccount,
}: {
  selectedPeriod: string;
  selectedAccount: Account;
}) {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const getCategoryFromTransaction = (transaction: any) => {
    try {
      const cat = JSON.parse(transaction.personal_finance_category || "{}");
      return cat.primary || "Other";
    } catch {
      return "Other";
    }
  };

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Income: "bg-green-100 text-green-800",
      "Food and Drink": "bg-orange-100 text-orange-800",
      Transportation: "bg-blue-100 text-blue-800",
      Entertainment: "bg-purple-100 text-purple-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors["Other"];
  };

  const fetchTransactions = async (month: string, accountId: string) => {
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

  useEffect(() => {
    const income = transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const expense = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    setTotalIncome(income);
    setTotalExpense(expense);
  }, [transactions]);
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
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* <h3 className="text-lg font-semibold text-gray-900">Transactions</h3> */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0  p-2 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <ReceiptIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-bold text-blue-600">
                    {transactions.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Income</p>
                  <p className="text-lg font-bold text-green-600">
                    <CountUp
                      start={0}
                      end={totalIncome}
                      duration={1}
                      decimals={2}
                      separator=","
                      prefix="$"
                    />
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-full">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Expenses</p>
                  <p className="text-lg font-bold text-red-600">
                    <CountUp
                      start={0}
                      end={totalExpense}
                      duration={1}
                      decimals={2}
                      separator=","
                      prefix="$"
                    />
                  </p>
                </div>
              </div>
            </div>
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
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.transaction_id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {transaction.name || transaction.merchant_name}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            getCategoryFromTransaction(transaction)
                          )}`}
                        >
                          {getCategoryFromTransaction(transaction)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{transaction.merchant_name || "unknown"}</span>
                        <span>•</span>
                        <span>
                          {transaction.datetime
                            ? new Date(transaction.datetime).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div
                        className={`text-xl font-bold ${
                          transaction.amount <= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount < 0 ? "+" : "-"}$
                        {formatCurrency(Math.abs(transaction.amount))}
                      </div>
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
