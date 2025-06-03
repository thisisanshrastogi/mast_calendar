import express from "express";
import cors from "cors";

import sequelize from "./config/db.js";
import plaidRouter from "./routes/palid_routes.js";
import authRouter from "./routes/auth.routes.js";
import verifySession from "./middleware/verifySession.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Calendar API is running");
});
app.use("/api", authRouter);

app.post("/api/events", verifySession, (req, res) => {
  res.status(200).json({ message: "Event received" });
});

app.use("/api/user",verifySession, userRouter);
app.use("/api/plaid", verifySession, plaidRouter);

sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced successfully");
  app.listen(5000, () => console.log("Server running on port 5000"));
});
