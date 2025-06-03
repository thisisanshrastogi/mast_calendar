import { connectRabbitMQ } from "../rabbit.js";
import { User } from "../models/index.js";

export const queuePullToDB = async (req, res) => {
  const email = req.email;
  const user = await User.findOne({
    where: { email: email },
    attributes: ["id", "email", "plaid_access_token"],
  });
  if (!user) {
    console.error("User not found in database:", email);
    return res.status(404).json({ error: "User not found" });
  }

  const channel = await connectRabbitMQ();
  const message = JSON.stringify({
    email: user.email,
    access_token: user.plaid_access_token,
    id: user.id,
  });
  console.log("Queuing message for user data fetch:", message);

  channel.sendToQueue("user-data-fetch", Buffer.from(message), {
    persistent: true,
  });
  res.status(200).json({ message: "User onboarded, data fetch queued" });
};
