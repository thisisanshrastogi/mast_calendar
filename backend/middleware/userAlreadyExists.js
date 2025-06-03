import { User } from "../models/index.js";

const userAlreadyExists = async (req, res, next) => {
  const email = req.email;
  if (!email) {
    return res.status(401).json({ error: "Email header missing" });
  }

  try {
    const user = await User.findOne({ where: { email: email } });
    console.log(!user);
    if (!user) {
      console.log("User does not exist, proceeding to next middleware");
      next();
    } else {
      console.log("User already exists");
      return res.status(250).json({ error: "User already exists" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export default userAlreadyExists;
