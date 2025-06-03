import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,
  }
);

export default async function connectToDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to DB");
    await sequelize.sync({ alter: false });
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
}
