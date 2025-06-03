import amqplib from "amqplib";

async function sendSimulatedMessage() {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queueName = "user-data-fetch";

  await channel.assertQueue(queueName, { durable: true });

  const simulatedMessage = {
    email: "ironmaninfinitywar123@gmail.com",
    access_token: "access-sandbox-bd873fe3-a0cf-4a32-baf2-64bfa52fe234",
    id: "ac266b6f-2901-4e0a-861c-23e77511c143",
  };

  channel.sendToQueue(
    queueName,
    Buffer.from(JSON.stringify(simulatedMessage)),
    {
      persistent: true,
    }
  );

  console.log("Simulated message sent");

  await channel.close();
  await connection.close();
}

sendSimulatedMessage().catch(console.error);
