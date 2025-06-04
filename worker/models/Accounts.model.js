import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // adjust path as needed
import User from "./Users.model.js"; // assuming you have a User model for email reference

const Account = sequelize.define(
  "Account",
  {
    account_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    balance_available: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    balance_current: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    mask: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    financial_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "accounts",
    timestamps: false,
  }
);

export default Account;
