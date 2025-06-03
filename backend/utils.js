import db from "./config/db.js";
import plaidClient from "./config/plaid_conf.js";
import { User } from "./models/index.js";

export const getCategories = async () => {
  try {
    const response = await plaidClient.categoriesGet({});
    const categories = response.data.categories;
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

export const getAccessTokenFromDb = async (email) => {
  try {
    const user = await User.findOne({
      where: { email: email },
      attributes: ["plaid_access_token"],
    });
    if (!user) {
      throw new Error("Access token not found for user");
    }
    console.log(user.plaid_access_token);
    return user.plaid_access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Failed to fetch access token");
  }
};

export const userExist = async (email) => {
  try {
    const user = await User.findOne({
      where: { email: email },
    });
    return user !== null;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw new Error("Failed to check user existence");
  }
};

export const createUser = async (email, accessToken) => {
  try {
    const user = await User.create({
      email: email,
      plaid_access_token: accessToken,
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

