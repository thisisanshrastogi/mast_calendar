import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // Adjust the path as needed
import Account from "./Accounts.js";

const RecurringTransaction = sequelize.define(
  "RecurringTransaction",
  {
    account_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Account,
        key: "account_id",
      },
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    last_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    predicte_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    personal_finance_category: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    average_amount: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    last_amount: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("inflow", "outflow"),
      allowNull: false,
    },
  },
  {
    tableName: "recurring_transactions",
    timestamps: true,
  }
);

export default RecurringTransaction;
