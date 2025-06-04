"use client";

import { useEffect, useState } from "react";
import { type Account, mockAccounts } from "../lib/mock-data.ts";
import axi from "../utils/axios_cofig.ts";
import LoaderMessage from "./Loader2.tsx";

interface AccountSelectorProps {
  onSelectAccount: (account: Account) => void;
}

export default function AccountSelector({
  onSelectAccount,
}: AccountSelectorProps) {
  const [loader, setLoader] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const fetchAccounts = async () => {
    try {
      setLoader(true);
      const response = await axi.get("/user/accounts", {
        withCredentials: true,
      });

      setAccounts(response.data);
      setLoader(false);

      console.log("Fetched Accounts:", response.data);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      setLoader(false);
    }
  };
  useEffect(() => {
    fetchAccounts();
  }, []);

  if (loader) {
    return (
      <div className="h-screen w-full">
        <LoaderMessage customMessage={"Loading accounts..."} />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Select an Account
        </h2>
        <p className="text-gray-600 mb-6">
          Choose an account to view its transactions, recurring bills, and
          manage your finances.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.length != 0 &&
            accounts.map((account) => (
              <div
                key={account.account_id}
                onClick={() => onSelectAccount(account)}
                className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg p-5 cursor-pointer transition-all"
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {account.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      ****{account.mask}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {account.name}
                  </h3>
                  <div
                    className={`text-xl font-bold ${
                      account.balance_current >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    $
                    {Math.abs(account.balance_current).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                    {account.balance_current < 0 && (
                      <span className="text-xs ml-1">Owed</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {account.subtype}
                    </span>
                    <span className="text-sm text-gray-500">
                      {account.financial_name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
