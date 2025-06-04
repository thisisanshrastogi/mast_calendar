import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";
import User from "./Users.model.js";

const Feedback = sequelize.define(
  "Feedback",
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User, // Assuming you have a User model
        key: "id",
      },
    },
    rating: {
      type: DataTypes.ENUM("up", "down"),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "feedbacks",
    timestamps: false,
  }
);

export default Feedback;
