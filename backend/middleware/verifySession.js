import e from "express";
import admin from "../config/firebaseAdmin.mjs";

const verifySession = async (req, res, next) => {
  // console.log(req)

  try {
    const sessionCookie = req.cookies.session || "";

    const decodedCookie = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);
    // console.log("Decoded Cookie:", decodedCookie);
    console.log("Token verified for user");
    req.email = decodedCookie.email;
    req.name = decodedCookie.name;
    next();
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return res.status(401).send("UNAUTHORIZED");
  }
};

export default verifySession;
