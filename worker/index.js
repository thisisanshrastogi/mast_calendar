import connectToDB from "./config/db.js";
import connectToQueue from "./config/rabbit.js";

const runWorker = async () => {
  await connectToDB();
  await connectToQueue();
};

runWorker().catch((err) => {
  console.error("Error running worker:", err);
  process.exit(1);
});
