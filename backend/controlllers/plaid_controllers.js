import plaidClient from "../config/plaid_conf.js";
import { User } from "../models/index.js";
import { getAccessTokenFromDb } from "../utils.js";

export const createLinkToken = async (req, res) => {
  try {
    const name = req.name;
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: name,
      },
      client_name: "Mast Calendar",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error creating link token:", error);
    return res.status(500).json({ error: "Failed to create link token" });
  }
};

export const exchangePublicToken = async (req, res, next) => {
  const { public_token } = req.body;
  const email = req.email;
  const name = req.name;

  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });
    const access_token = response.data.access_token;

    if (access_token) {
      await User.create({
        email: email,
        name: name,
        plaid_access_token: access_token,
      });
    }
    req.accessToken = access_token; // Store access token in request for next middleware
    console.log("Exchanged public token for access token:", access_token);
    next();
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return res.status(500).json({ error: "Failed to exchange public token" });
  }
};

export const getTransactions = async (req, res) => {
  const email = req.email || "ironmaninfinitywar123@gmail.com";

  const accessToken = await getAccessTokenFromDb(email);
  if (!accessToken) {
    return res.status(404).json({ error: "Access token not found for user" });
  }

  // Fetch all transactions by paginating through results
  const request = {
    access_token: accessToken,
    start_date: "2018-01-01",
    end_date: "2025-06-01",
  };
  try {
    const response = await plaidClient.transactionsGet(request);
    console.log(response);
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

    console.log(transactions.length, "transactions fetched");

    // const transactions = transactionsResponse.data.transactions;
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
    res.json({ accounts: response.data.accounts, transactions: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

export const getRecurringTransactions = async (req, res) => {
  const email = req.email || "aadi@gmail.com";
  const accessToken = await getAccessTokenFromDb(email);
  if (!accessToken) {
    return res.status(404).json({ error: "Access token not found for user" });
  }
  try {
    const response = await plaidClient.transactionsRecurringGet({
      access_token: accessToken,
    });

    const inflowStreams = response.data.inflow_streams;
    const outflowStreams = response.data.outflow_streams;

    res.status(200).json({
      inflowStreams: inflowStreams,
      outflowStreams: outflowStreams,
    });
  } catch (error) {
    console.error("Error fetching recurring transactions:", error);
    res.status(500).json({ error: "Failed to fetch recurring transactions" });
  }
};
