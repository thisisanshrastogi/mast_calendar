import express from "express";
import {
  getAccountsForUser,
  getRecurringFlow,
  getRecurringTransactions,
  getTransactions,
} from "../controlllers/transactions.controller.js";
import getUserId from "../middleware/getUserId.js";
import getUserStatus from "../controlllers/auth.controller.js";
import verifyAccount from "../middleware/verifyAccount.js";
import {
  getFeedbackStatus,
  storeFeedback,
} from "../controlllers/feedback.controller.js";
const router = express.Router();

// {"month": 1, "accountId": "12345"}
router.post("/transactions", getTransactions);

router.get("/accounts", getUserId, getAccountsForUser);

router.post("/recurring_transactions", getRecurringTransactions);

router.get("/status", getUserStatus);

router.get("/feedback_status", getFeedbackStatus);

router.post("/feedback", storeFeedback);

router.post("/recurring_flows", getRecurringFlow);

export default router;
