import User from "./models/Users.js";

export const getAccessTokenFromDb = async (email) => {
  try {
    const user = await User.findOne({
      where: { email: email },
      attributes: ["id", "plaid_access_token"],
    });
    if (!user) {
      throw new Error("Access token not found for user");
    }
    console.log(user.plaid_access_token);
    return { id: user.id, plaid_access_token: user.plaid_access_token };
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Failed to fetch access token");
  }
};
