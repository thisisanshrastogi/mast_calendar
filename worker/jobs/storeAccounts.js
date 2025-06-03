import { Account, User } from "../models/index.js";

const storeAccounts = async (accounts, userId) => {
  try {
    // Prepare bulk data for upsert (update or insert)
    const bulkData = accounts.map((account) => ({
      account_id: account.account_id,
      balance_available: account.balances.available,
      balance_current: account.balances.current,
      mask: account.mask,
      name: account.name,
      financial_name: account.official_name,
      type: account.type,
      subtype: account.subtype,
      userId: userId,
    }));

    // Use bulkCreate with updateOnDuplicate for batch upsert
    await Account.bulkCreate(bulkData, {
      updateOnDuplicate: [
        "balance_available",
        "balance_current",
        "mask",
        "name",
        "financial_name",
        "type",
        "subtype",
        "userId",
      ],
    });
  } catch (error) {
    console.error("Error storing accounts:", error);
    throw new Error("Failed to store accounts");
  }
};

export default storeAccounts;
