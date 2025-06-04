import { Feedback, User } from "../models/index.js";

export const storeFeedback = async (req, res) => {
  try {
    const { rating, phone } = req.body;
    const email = req.email;

    if (!rating || !email) {
      return res.status(400).json({ message: "Phone and email are required." });
    }

    // Assuming you have a Feedback model to store the feedback
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await Feedback.create({
      userId: user.id,
      phone: phone,
      rating: rating,
    });

    res.status(201).json({ message: "Feedback stored successfully" });
  } catch (error) {
    console.error("Error storing feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFeedbackStatus = async (req, res) => {
  try {
    const email = req.email;

    if (!email) {
      return res.status(401).json({ error: "Email header missing" });
    }

    const feedback = await Feedback.findOne({
      attributes: ["rating", "phone"],
      include: {
        model: User,
        where: { email: email },
      },
    });
    console.log("Feedback for user:", feedback);

    if (!feedback) {
      return res
        .status(250)
        .json({ message: "No feedback found for this user" });
    }

    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
