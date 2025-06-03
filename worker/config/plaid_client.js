import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import dotenv from "dotenv";
dotenv.config();

const config = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(config);

export default plaidClient;
