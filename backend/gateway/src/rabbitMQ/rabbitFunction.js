const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });
const {rabbitConfig} = require("./rabbitConfig");
const {connectRabbitMQ} = require("./rabbitConnect");

function createChannel() {
    const conn = connectRabbitMQ();
  
    const channelWrapper = conn.createChannel({
      setup: async (channel) => {
        for (const ex of rabbitConfig.exchanges) {
          await channel.assertExchange(ex.name, ex.type, { durable: true });
          console.log(`Exchange ensured: ${ex.name} (${ex.type})`);
        }

        for (const q of rabbitConfig.queues) {
          await channel.assertQueue(q.name, { durable: true });
          console.log(`Queue ensured: ${q.name}`);
  
          await channel.bindQueue(q.name, q.exchange, q.bindingKey);
          console.log(`Bound queue: ${q.name} -> ${q.exchange} (${q.bindingKey})`);
        }
      },
    });
    return channelWrapper;
}

const publishMsg = async (data, exchange, routingKey) => {
    const message = JSON.stringify(data);
    const channel = createChannel();
  
    await channel.waitForConnect();
  
    await channel.publish(exchange, routingKey, Buffer.from(message), {
      persistent: true,
    });
  
    console.log(`Sent message to [${exchange}] via [${routingKey}]: ${message}`);
}

module.exports = {
    createChannel,
    publishMsg,
};
