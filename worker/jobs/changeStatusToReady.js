import { User } from "../models/index.js";

const changeStatusToReady = async (userId) => {
  try {
    await User.update({ status: "ready" }, { where: { id: userId } });
  } catch (error) {
    console.error(
      `Error updating user status to 'ready' for user ID ${userId}:`,
      error
    );
  }
};
export default changeStatusToReady;
