import { Op } from "sequelize";
import Transaction from "../models/Transactions.model.js";
import { Account, RecurringTransaction } from "../models/index.js";

export const getTransactions = async (req, res) => {
  try {
    const { month, accountId } = req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "User ID is required." });
    }

    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        message:
          "Invalid month parameter. It should be a number between 1 and 12.",
      });
    }

    const now = new Date();
    const firstOfTheMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - month, 1)
    );

    const transactions = await Transaction.findAll({
      where: {
        account_id: accountId,
        datetime: {
          [Op.gte]: firstOfTheMonth,
          [Op.lte]: now,
        },
      },
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAccountsForUser = async (req, res) => {
  try {
    const userId = req.userId;

    const accounts = await Account.findAll({
      where: {
        userId: userId,
      },
    });

    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecurringTransactions = async (req, res) => {
  try {
    const accountId = req.body.accountId;
    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required." });
    }

    const recurringTransactions = await RecurringTransaction.findAll({
      where: {
        account_id: accountId,
      },
    });

    res.status(200).json(recurringTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
