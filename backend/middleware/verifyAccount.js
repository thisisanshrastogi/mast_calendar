import { Account } from "../models/index.js";

const verifyAccount = async (req, res, next) => {
  const userId = req.userId;
  const accountId = req.body.accountId;
  if (!userId || !accountId) {
    return res
      .status(400)
      .json({ error: "User ID and Account ID are required." });
  }

  const response = await Account.findOne({
    where: { account_id: accountId, userId: userId },
  });
  if (!response) {
    return res.status(404).json({ error: "Account not found." });
  }
  req.account = req.body.accountId;
  next();
};

export default verifyAccount;
