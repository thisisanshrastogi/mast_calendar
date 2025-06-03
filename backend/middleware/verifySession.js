import e from "express";
import admin from "../config/firebaseAdmin.mjs";

const verifySession = async (req, res, next) => {
  // console.log(req)

  try {
    console.log(req.cookies);
    const sessionCookie = req.cookies.session || "";

    const decodedCookie = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);
    console.log("Decoded Cookie:", decodedCookie);
    req.email = decodedCookie.email;
    req.name = decodedCookie.name;
    next();
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return res.status(401).send("UNAUTHORIZED");
  }
};

export default verifySession;
