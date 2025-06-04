import amqplib, { connect } from "amqplib";
import fetchTransactions from "../services/fetchTransactions.js";
import storeAccounts from "../jobs/storeAccounts.js";
import storeTransactions from "../jobs/storeTransactions.js";
import fetchRecurring from "../services/fetchRecurring.js";
import storeRecurringTransactions from "../jobs/storeRecurring.js";
import changeStatusToReady from "../jobs/changeStatusToReady.js";

const RABBIT_MQ_URL = "amqp://rabbitmq:5672";
const QUEUE = "user-data-fetch";

export default async function connectToQueue() {
  console.log("Worker started, waiting for messages...");
  try {
    const connection = await amqplib.connect(RABBIT_MQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });
    channel.prefetch(1);
    console.log("Connected to RabbitMQ successfully");

    channel.consume(
      QUEUE,
      async (message) => {
        if (message !== null) {
          try {
            const data = JSON.parse(message.content.toString());
            console.log("Received message:", data);

            if (!data || !data.access_token || !data.id || !data.email) {
              console.error("Invalid message format:", data);
              console.log("Required format: { access_token, id, email }");
              channel.nack(message, false, false);
              return;
            }

            // Fetch transactions for the user
            const response = await fetchTransactions(data.access_token);
            console.log("fetched  response:", response.accounts.length);
            // Store accounts and transactions
            await storeAccounts(response.accounts, data.id);
            console.log("Accounts stored successfully for user:", data.email);

            await storeTransactions(response.transactions);
            console.log(
              "Transactions stored successfully for user:",
              data.email
            );
            // fetch recurring transactions
            const recurringResponse = await fetchRecurring(data.access_token);

            console.log("Fetched recurring transactions for user:", data.email);

            await storeRecurringTransactions(recurringResponse);
            console.log(
              "Recurring transactions stored successfully for user:",
              data.email
            );

            await changeStatusToReady(data.id);
            console.log("Status changed to 'ready' for user:", data.email);

            channel.ack(message);
          } catch (error) {
            console.error(`Error processing message for user :`, error);
            channel.nack(message, false, false);
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
}
