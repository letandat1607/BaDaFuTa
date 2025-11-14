const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });
const {rabbitConfig} = require("./rabbitConfig");
const {connectRabbitMQ} = require("./rabbitConnect");

let publishChannel = null;

async function getPublishChannel() {
    if (publishChannel) return publishChannel;

    const conn = connectRabbitMQ();
    publishChannel = conn.createChannel({
        setup: async (channel) => {
            for (const ex of rabbitConfig.exchanges) {
                await channel.assertExchange(ex.name, ex.type, { durable: true });
            }
        }
    });

    await publishChannel.waitForConnect();
    return publishChannel;
}

async function publishMsg(data, exchange, routingKey) {
  const message = Buffer.from(JSON.stringify(data));
  const channel = await getPublishChannel();

  const sent = channel.publish(exchange, routingKey, message, {
      persistent: true,
      contentType: 'application/json',
  });

  if (sent) {
      console.log(`Published [${routingKey}] → ${exchange}`);
  } else {
      console.warn(`Failed to publish [${routingKey}]`);
  }
}

module.exports = {
    publishMsg,
};
