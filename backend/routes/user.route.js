import express from "express";
import {
  getAccountsForUser,
  getRecurringTransactions,
  getTransactions,
} from "../controlllers/transactions.controller.js";
import getUserId from "../middleware/getUserId.js";
import getUserStatus from "../controlllers/auth.controller.js";
const router = express.Router();

// {"month": 1, "accountId": "12345"}
router.post("/transactions", getUserId, getTransactions);

router.get("/accounts", getUserId, getAccountsForUser);

router.post("/recurring_transactions", getUserId, getRecurringTransactions);

router.get("/status", getUserStatus);

export default router;
