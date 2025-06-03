import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // Adjust path as needed
import Account from "./Accounts.js"; // Adjust path as needed

const Transaction = sequelize.define(
  "Transaction",
  {
    account_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Account,
        key: "account_id",
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    merchant_name: {
      type: DataTypes.STRING,
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    personal_finance_category: {
      type: DataTypes.TEXT,
    },
    personal_finance_category_icon_url: {
      type: DataTypes.TEXT,
    },
    payment_channel: {
      type: DataTypes.STRING,
    },
    counter_parties_involved: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "transactions",
  }
);

export default Transaction;
