import { RecurringTransaction } from "../models/index.js";

const storeRecurringTransactions = async (recurring_transactions) => {
  try {
    const inflows = recurring_transactions.inflow_streams || [];
    const outflows = recurring_transactions.outflow_streams || [];

    const inflowbulkData = inflows.map((transaction) => {
      return {
        account_id: transaction.account_id,
        frequency: transaction.frequency,
        first_date: transaction.first_date,
        last_date: transaction.last_date,
        predicted_date: transaction.predicted_date,
        description: transaction.description,
        personal_finance_category: JSON.stringify(
          transaction.personal_finance_category
        ),
        average_amount: JSON.stringify(transaction.average_amount),
        last_amount: JSON.stringify(transaction.last_amount),
        is_active: transaction.is_active,
        status: transaction.status,
        type: "inflow",
      };
    });
    const outflowbulkData = outflows.map((transaction) => {
      return {
        account_id: transaction.account_id,
        frequency: transaction.frequency,
        first_date: transaction.first_date,
        last_date: transaction.last_date,
        predicted_date: transaction.predicted_date,
        description: transaction.description,
        personal_finance_category: JSON.stringify(
          transaction.personal_finance_category
        ),
        average_amount: JSON.stringify(transaction.average_amount),
        last_amount: JSON.stringify(transaction.last_amount),
        is_active: transaction.is_active,
        status: transaction.status,
        type: "outflow",
      };
    });
    // Combine inflow and outflow data
    const bulkData = [...inflowbulkData, ...outflowbulkData];

    await RecurringTransaction.bulkCreate(bulkData, {
      updateOnDuplicate: [
        "account_id",
        "frequency",
        "first_date",
        "last_date",
        "predicted_date",
        "description",
        "personal_finance_category",
        "average_amount",
        "last_amount",
        "is_active",
        "status",
        "type",
      ],
    });
  } catch (error) {
    console.error("Error storing recurring transactions:", error);
    throw new Error("Failed to store recurring transactions");
  }
};

export default storeRecurringTransactions;
