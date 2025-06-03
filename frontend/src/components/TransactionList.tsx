// src/components/Transactions.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import axi from "../utils/axios_cofig";
import Loader from "./Loader";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (month, accountId) => {
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
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axi.get("/user/accounts", {
          withCredentials: true,
        });
        setAccounts(res.data);
        await fetchTransactions(1, res.data[0].account_id);
        console.log("Fetched Accounts:", res.data);
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
      }
    };
    fetchAccounts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="px-4  overflow-auto w-full relative shadow-2xl bg-white h-full">
      <h2 className="text-xl font-semibold sticky inset-0  w-full mb-4 bg-white py-4 px-2 ">
        Transactions: <span>{transactions.length}</span>
      </h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-4   ">
          {transactions.map((txn) => (
            <li
              key={txn.transaction_id}
              className="border border-slate-100 bg-white p-4 rounded-2xl flex items-center gap-5 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex-shrink-0">
                {txn.personal_finance_category_icon_url ? (
                  <img
                    src={txn.personal_finance_category_icon_url}
                    alt={txn.personal_finance_category?.primary || "Category"}
                    className="w-12 h-12 rounded-full bg-white border-2 border-teal-200 object-contain shadow"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-400 text-2xl font-bold border-2 border-teal-100">
                    <span>💸</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-teal-900 text-base block truncate">
                    {txn.name}
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      txn.amount > 0 ? "text-rose-500" : "text-emerald-600"
                    }`}
                  >
                    {txn.amount > 0 ? "-" : ""}
                    {txn.iso_currency_code} {Math.abs(txn.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-medium text-white bg-gradient-to-r from-teal-400 to-cyan-500 px-2 py-1 rounded-full shadow">
                    {typeof txn.personal_finance_category === "string"
                      ? JSON.parse(txn.personal_finance_category).primary
                      : txn.personal_finance_category?.primary}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(txn.datetime || txn.date).toLocaleDateString()}
                  </span>
                </div>
                {/* {txn.counter_parties_involved && (
                  <div className="flex flex-wrap items-center mt-2 gap-2">
                    {JSON.parse(txn.counter_parties_involved).map((cp) => (
                      <div
                        key={cp.entity_id}
                        className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full shadow-sm"
                      >
                        {cp.logo_url && (
                          <img
                            src={cp.logo_url}
                            alt={cp.name}
                            className="w-5 h-5 rounded-full"
                          />
                        )}
                        <span className="text-xs text-gray-700">{cp.name}</span>
                      </div>
                    ))}
                  </div>
                )} */}
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                  <span className="font-medium text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
                    {txn.payment_channel?.charAt(0).toUpperCase() +
                      txn.payment_channel?.slice(1)}
                  </span>
                  <span className="text-gray-200">•</span>
                  <span className="italic">Channel</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Transactions;
