import express from "express";
import {
  createLinkToken,
  exchangePublicToken,
  getRecurringTransactions,
  getTransactions,
} from "../controlllers/plaid_controllers.js";
import { getCategories } from "../utils.js";
import { queuePullToDB } from "../controlllers/message_queue.controller.js";
import userAlreadyExists from "../middleware/userAlreadyExists.js";

const router = express.Router();

router.post("/create_link_token", userAlreadyExists, createLinkToken);

router.post(
  "/exchange_public_token",
  userAlreadyExists,
  exchangePublicToken,
  queuePullToDB
);

// router.get("/transactions", (req, res) => {
//   res.status(200).json({ message: "Transactions endpoint is working" });
// });

// router.get("/recurring_transactions", getRecurringTransactions);

// router.get("/categories", async (req, res) => {
//   try {
//     const categories = await getCategories();
//     res.status(200).json(categories);
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     res.status(500).json({ error: "Failed to fetch categories" });
//   }
// });
export default router;
