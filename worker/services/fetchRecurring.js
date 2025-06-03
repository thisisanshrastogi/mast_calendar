import plaidClient from "../config/plaid_client.js";

const fetchRecurring = async (accessToken) => {
  try {
    const response = await plaidClient.transactionsRecurringGet({
      access_token: accessToken,
    });

    const inflowStreams = response.data.inflow_streams;
    const outflowStreams = response.data.outflow_streams;

    return {
      inflow_streams: inflowStreams,
      outflow_streams: outflowStreams,
    };
  } catch (error) {
    console.error("Error fetching recurring transactions:", error);
    throw new Error("Failed to fetch recurring transactions");
  }
};
export default fetchRecurring;
