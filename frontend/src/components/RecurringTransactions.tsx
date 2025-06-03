import React, { useEffect, useState } from "react";
import axi from "../utils/axios_cofig";
import Loader from "./Loader";

const RecurringTransactions = () => {
  const [inflows, setInflows] = useState([]);
  const [outflows, setOutflows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecurringTransactions = async () => {
    try {
      const response = await axi.get("/plaid/recurring_transactions");
      console.log(response);
      // Expecting data to be in format: { inflowStreams: [], outflowStreams: [] }
      return {
        inflowStreams: response.data.inflowStreams || [],
        outflowStreams: response.data.outflowStreams || [],
      };
    } catch (error) {
      console.error("Failed to fetch recurring transactions:", error);
      return {
        inflowStreams: [],
        outflowStreams: [],
      };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const { inflowStreams, outflowStreams } =
        await fetchRecurringTransactions();
      setInflows(inflowStreams);
      setOutflows(outflowStreams);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="px-6 w-full h-full overflow-auto bg-white relative rounded-xl shadow-md">
      <h1 className="text-2xl py-4 px-2 font-bold mb-6 text-gray-800 sticky inset-0 bg-white border-b border-teal-200/40">
        Recurring Transactions
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inflow Streams */}
        <section className="border border-teal-50 shadow-xl rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4 text-green-700 flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
            Inflows
          </h2>
          {inflows.length === 0 ? (
            <p className="text-gray-500">No inflows found</p>
          ) : (
            <ul className="space-y-4">
              {inflows.map((stream, idx) => (
                <li
                  key={idx}
                  className="border-l-4 border-green-400 bg-green-50 p-4 rounded flex flex-col gap-1"
                >
                  <span className="font-medium text-gray-700">
                    {stream.description || "N/A"}
                  </span>
                  <span className="text-sm text-gray-500">
                    <strong>Amount:</strong> $
                    {Math.abs(stream.average_amount.amount)}
                  </span>
                  <span className="text-sm text-gray-500">
                    <strong>Next Date:</strong> {stream.predicted_next_date}
                  </span>
                  <span className="text-sm text-gray-500">
                    <strong>Category:</strong>{" "}
                    {stream.personal_finance_category?.primary || "Unknown"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        {/* Outflow Streams */}
        <section className="border border-teal-50 shadow-xl rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4 text-red-700 flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-red-400 rounded-full"></span>
            Outflows
          </h2>
          {outflows.length === 0 ? (
            <p className="text-gray-500">No outflows found</p>
          ) : (
            <ul className="space-y-4">
              {outflows.map((stream, idx) => (
                <li
                  key={idx}
                  className="border-l-4 border-red-400 bg-red-50 p-4 rounded flex flex-col gap-1"
                >
                  <span className="font-medium text-gray-700">
                    {stream.description || "N/A"}
                  </span>
                  <span className="text-sm text-gray-500">
                    <strong>Amount:</strong> ${stream.average_amount.amount}
                  </span>
                  <span className="text-sm text-gray-500">
                    <strong>Next Date:</strong> {stream.predicted_next_date}
                  </span>
                  <span className="text-sm text-gray-500">
                    <strong>Category:</strong>{" "}
                    {stream.personal_finance_category?.primary || "Unknown"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default RecurringTransactions;
