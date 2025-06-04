import amqplib from "amqplib";

const queue = "user-data-fetch";

const fetchData = async (userId) => {
  console.log(`Fetching data for user: ${userId}`);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(`Data fetched and stored for user: ${userId}`);
};

(async () => {
  console.log("Worker started, waiting for messages...");
  try {
    const connection = await amqplib.connect("amqp://rabbitmq:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    channel.consume(
      queue,
      async (message) => {
        if (message !== null) {
          const data = JSON.parse(message.content.toString());
          console.log("Received message:", data);
          try {
            await fetchData("fake");
            channel.ack(message);
          } catch (error) {
            console.error(`Error processing message for user ${data}:`, error);
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
})();
