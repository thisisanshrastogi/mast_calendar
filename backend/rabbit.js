import amqplib from 'amqplib';

let channel;
const queue = 'user-queue';


export const connectRabbitMQ = async()=>{

    if (channel) return channel;
    const connection = await amqplib.connect('amqp://localhost');
    channel = await connection.createChannel();

    await channel.assertQueue('user-data-fetch',{durable:true})
    return channel;
}
