import Account from "./Accounts.js";
import RecurringTransaction from "./RecurringTransactions.js";
import Transaction from "./Transactions.js";
import User from "./Users.js";

User.hasMany(Account, { foreignKey: "userId", onDelete: "CASCADE" });
Account.belongsTo(User, { foreignKey: "userId" });

Account.hasMany(Transaction, { foreignKey: "account_id", onDelete: "CASCADE" });
Transaction.belongsTo(Account, { foreignKey: "account_id" });

Account.hasMany(RecurringTransaction, {
  foreignKey: "account_id",
  onDelete: "CASCADE",
});

RecurringTransaction.belongsTo(Account, {
  foreignKey: "account_id",
  onDelete: "CASCADE",
});

export { User, Account, Transaction, RecurringTransaction };
