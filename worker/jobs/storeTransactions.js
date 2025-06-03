import { Transaction, User } from "../models/index.js";

const storeTransactions = async (transactions) => {
  try {
    const bulkData = transactions.map((transaction) => ({
      transaction_id: transaction.transaction_id,
      account_id: transaction.account_id,
      amount: transaction.amount,
      datetime: transaction.datetime || transaction.date, // fallback if datetime missing
      name: transaction.name,
      merchant_name: transaction.merchant_name,
      personal_finance_category: JSON.stringify(
        transaction.personal_finance_category
      ),
      personal_finance_category_icon_url:
        transaction.personal_finance_category_icon_url,
      payment_channel: transaction.payment_channel,
      counter_parties_involved: JSON.stringify(transaction.counterparties),
    }));

    await Transaction.bulkCreate(bulkData, {
      updateOnDuplicate: [
        "account_id",
        "amount",
        "datetime",
        "name",
        "merchant_name",
        "personal_finance_category",
        "personal_finance_category_icon_url",
        "payment_channel",
        "counter_parties_involved",
      ],
    });
  } catch (error) {
    console.error("Error storing transactions:", error);
    throw new Error("Failed to store transactions");
  }
};

export default storeTransactions;
