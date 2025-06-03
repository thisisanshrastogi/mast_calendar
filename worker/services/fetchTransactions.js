import plaidClient from "../config/plaid_client.js";
import { getAccessTokenFromDb } from "../utils.js";

const fetchTransactions = async (accessToken) => {
  // Fetch all transactions by paginating through results
  console.log("Fetching transactions for access token:", accessToken);
  const request = {
    access_token: accessToken,
    start_date: "2018-01-01",
    end_date: "2025-06-01",
  };
  try {
    const response = await plaidClient.transactionsGet(request);
    let transactions = response.data.transactions;
    const total_transactions = response.data.total_transactions;
    // Manipulate the offset parameter to paginate
    // transactions and retrieve all available data
    while (transactions.length < total_transactions) {
      const paginatedRequest = {
        access_token: accessToken,
        start_date: "2018-01-01",
        end_date: "2025-06-01",
        options: {
          offset: transactions.length,
        },
      };
      const paginatedResponse = await plaidClient.transactionsGet(
        paginatedRequest
      );
      transactions = transactions.concat(paginatedResponse.data.transactions);
    }

    const filteredTransactions = transactions.map((txn) => {
      const isReceived =
        txn.transaction_type === "credit" ||
        txn.personal_finance_category?.primary === "INCOME" ||
        txn.category?.some(
          (cat) =>
            typeof cat === "string" && cat.toLowerCase().includes("income")
        );

      return {
        ...txn,
        isReceived: !!isReceived,
      };
    });
    return {
      accounts: response.data.accounts,
      transactions: filteredTransactions,
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
};

export default fetchTransactions;
