import { Op } from "sequelize";
import Transaction from "../models/Transactions.model.js";
import { Account, RecurringTransaction, User } from "../models/index.js";

export const getTransactions = async (req, res) => {
  try {
    console.log("Getting transactions for user");
    const { month, accountId } = req.body;

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
      include: {
        model: Account,
        include: {
          model: User,
          where: {
            email: req.email,
          },
        },
      },
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
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
    console.log("Getting recurring transactions");
    const accountId = req.body.accountId;
    const email = req.email;
    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required." });
    }

    const recurringTransactions = await RecurringTransaction.findAll({
      where: {
        account_id: accountId,
      },
      include: {
        model: Account,
        include: {
          model: User,
          where: {
            email: req.email,
          },
        },
      },
    });

    // console.log("Printing result ", recurringTransactions);
    res.status(200).json(recurringTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMonthlyStatistics = async (req, res) => {};

export const getRecurringFlow = async (req, res) => {
  try {
    console.log("Getting recurring flows");
    const accountId = req.body.accountId;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required." });
    }

    const recurringTransactions = await RecurringTransaction.findAll({
      where: {
        account_id: accountId,
      },
      attributes: ["last_amount", "average_amount", "type"],
      include: {
        model: Account,
        include: {
          model: User,
          where: {
            email: req.email,
          },
        },
      },
    });
    if (recurringTransactions.length === 0) {
      return res.status(404).json({ message: "No recurring flows found." });
    }
    const inflowStreams = recurringTransactions.filter(
      (transaction) => transaction.type === "inflow"
    );
    const outflowStreams = recurringTransactions.filter(
      (transaction) => transaction.type === "outflow"
    );

    const safeParseAmount = (value) => {
      if (!value) return 0;
      try {
        const parsed = JSON.parse(value);
        return typeof parsed.amount === "number" ? parsed.amount : 0;
      } catch {
        return 0;
      }
    };

    const result = {
      average_inflow: inflowStreams.reduce((acc, curr) => {
        return acc + safeParseAmount(curr.average_amount);
      }, 0),
      last_inflow: inflowStreams.reduce((acc, curr) => {
        return acc + safeParseAmount(curr.last_amount);
      }, 0),
      average_outflow: outflowStreams.reduce((acc, curr) => {
        return acc + safeParseAmount(curr.average_amount);
      }, 0),
      last_outflow: outflowStreams.reduce((acc, curr) => {
        return acc + safeParseAmount(curr.last_amount);
      }, 0),
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching recurring flows:", error);
    res.status(500).json({ message: error.message });
  }
};
