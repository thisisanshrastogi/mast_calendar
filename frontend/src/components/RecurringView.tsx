"use client";

import { useEffect, useState } from "react";
import type {
  RecurringTransactionState,
  RecurringViewProps,
} from "../lib/interfaces.ts";
import Calendar from "./CustomCalendar.tsx";
import axi from "../utils/axios_cofig.ts";
import { toast } from "react-toastify";

export default function RecurringView({
  selectedAccount,
  viewMode,
}: RecurringViewProps) {
  const [recurring, setRecurring] = useState<
    RecurringTransactionState[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  const onBillPay = (billId: number) => {
    toast.info("Payment processing is not implemented yet. ", {
      position: "top-right",
      autoClose: 3000,
    });
    console.log(billId);
  };

  const fetchRecurringTransactions = async () => {
    try {
      setLoading(true);
      const response = await axi.post(
        "/user/recurring_transactions",
        {
          accountId: selectedAccount.account_id,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Fetched Recurring Transactions:", response.data);
      setRecurring(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch recurring transactions:", error);
      setRecurring(null);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRecurringTransactions();
  }, []);

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
        <span className="text-gray-600 text-lg">
          Loading Recurring Transactions...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Content */}
      <div className="min-h-[500px]">
        {viewMode === "calendar" ? (
          <Calendar bills={recurring} onPayBill={onBillPay} />
        ) : (
          <DetailedView bills={recurring} onPayBill={onBillPay} />
        )}
      </div>
    </div>
  );
}

function DetailedView({
  bills,
  onPayBill,
}: {
  bills: RecurringTransactionState[] | null;
  onPayBill: (billId: number) => void;
}) {
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid">("all");

  const filteredBills = bills?.filter((bill) => {
    if (filter === "paid") return !bill.is_active;
    if (filter === "unpaid") return bill.is_active;
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
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
              onClick={() => setFilter("unpaid")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                filter === "unpaid"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Unpaid
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                filter === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Paid
            </button>
          </div>
        </div>
      </div>
      <div className="max-h-96 sm:max-h-[500px] overflow-y-auto">
        {filteredBills?.length === 0 ? (
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
              <p>No bills found for the selected filter.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBills?.map((bill) => {
              // Parse values from new recurring structure
              const amount =
                typeof bill.last_amount === "string"
                  ? Math.abs(
                      (JSON.parse(bill.last_amount) as { amount: number })
                        .amount
                    )
                  : (bill.last_amount as { amount: number } | undefined)
                      ?.amount ?? 0;
              const category =
                typeof bill.personal_finance_category === "string"
                  ? JSON.parse(bill.personal_finance_category).detailed
                  : (bill.personal_finance_category as { detailed?: string })
                      ?.detailed ?? "";
              const frequency = bill.frequency?.toLowerCase() ?? "";
              const dueDate = bill.last_date
                ? new Date(bill.last_date).toLocaleDateString()
                : "";
              const name = bill.description || "Recurring Payment";
              // Assume isPaid is based on status or add logic as needed
              const isPaid = false;
              const isInflow = bill.type === "inflow";

              return (
                <div
                  key={bill.id}
                  className="px-4 sm:px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isInflow
                              ? "bg-green-400"
                              : isPaid
                              ? "bg-green-400"
                              : "bg-orange-400"
                          }`}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{name}</h4>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                            <p className="text-xs sm:text-sm text-gray-500">
                              {category}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Due: {dueDate}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 capitalize">
                              {frequency}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <span className="text-lg font-semibold text-gray-900">
                        $
                        {amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      {!isInflow && !isPaid && (
                        <button
                          onClick={() => onPayBill(bill.id)}
                          className="w-full sm:w-auto min-w-[112px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Pay Now
                        </button>
                      )}
                      {isInflow && (
                        <span className="w-full sm:w-auto min-w-[112px] bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm font-medium text-center flex items-center justify-center">
                          Inflow
                        </span>
                      )}
                      {!isInflow && isPaid && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium text-center">
                          Paid
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
