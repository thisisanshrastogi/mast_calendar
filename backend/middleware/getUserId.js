import { User } from "../models/index.js"; // Adjust the path and extension as needed

// Middleware to extract userId from database using email in request headers
const getUserId = async (req, res, next) => {
  const email = req.email || "ironmaninfinitywar123@gmail.com";
  if (!email) {
    return res.status(401).json({ error: "Email header missing" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.userId = user.id;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export default getUserId;

