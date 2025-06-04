import express from "express";
import admin from "../config/firebaseAdmin.mjs";
import { userExist } from "../utils.js";

const router = express.Router();

router.post("/sessionLogin", async (req, res) => {
  try {
    const { firebaseToken } = req.body;
    console.log(firebaseToken);
    if (!firebaseToken) {
      return res.status(400).json({ error: "Firebase token is required" });
    }
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    console.log("Token verified for user in sessionLogin");
    const email = decodedToken.email;

    const exists = await userExist(email);

    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    console.log("Hello");

    const sessionCookie = await admin
      .auth()
      .createSessionCookie(firebaseToken, { expiresIn });
    console.log("Session cookie ", sessionCookie);
    res.cookie("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    if (!exists) {
      console.log("User does not exist, redirecting to Plaid Link");
      return res
        .status(210)
        .json({ error: "User does not exist, redirect to Plaid Link" });
    }

    console.log("User exists, session created successfully");
    res.status(200).json({
      message: "Session created successfully",
    });
  } catch (error) {
    console.error("Error creating session cookie:", error);
    res.status(401).send("UNAUTHORIZED");
  }
});

router.post("/sessionLogout", async (req, res) => {
  try {
    console.log("Logging out");
    res.clearCookie("session");
    res.status(200).json({ message: "Session cleared successfully" });
  } catch (error) {
    console.error("Error clearing session cookie:", error);
    res.status(500).json({ error: "Failed to clear session cookie" });
  }
});

export default router;
