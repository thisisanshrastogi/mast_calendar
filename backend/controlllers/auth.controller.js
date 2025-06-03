import { User } from "../models/index.js";

const getUserStatus = async (req, res) => {
  try {
    const email = req.email;
    if (!email) {
      return res.status(401).json({ error: "Email header missing" });
    }
    const response = await User.findOne({
      where: { email: email },
      attributes: ["status"],
    });
    console.log(response);
    if (response.status === "ready") {
      return res.status(200).json({ status: "ready" });
    } else if (response.status === "failed") {
      return res.status(200).json({ status: "failed" });
    } else {
      return res.status(200).json({ status: "pending" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export default getUserStatus;
