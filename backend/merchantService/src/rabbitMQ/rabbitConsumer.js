const { connectRabbitMQ } = require("./rabbitConnect");
const { rabbitConfig } = require("./rabbitConfig");
const merchantService = require("../services/merchantService");

let consumeChannel = null;
async function startConsumers() {
    const conn = connectRabbitMQ();

    consumeChannel = conn.createChannel({
        setup: async (channel) => {
            for (const exchange of rabbitConfig.exchanges) {
                await channel.assertExchange(exchange.name, exchange.type, { durable: true });
            }

            for (const queue of rabbitConfig.queues) {
                await channel.assertQueue(queue.name, { durable: true });
                await channel.bindQueue(queue.name, queue.exchange, queue.bindingKey);

                await channel.consume(queue.name, async (msg) => {
                    if (!msg) return;
                    const content = JSON.parse(msg.content.toString());
                    try {
                        switch (queue.bindingKey) {
                            case "order.merchant.confirmed":
                                await merchantService.publishOrderGateway(content);
                                break;
                            case "order.merchant.send_all":
                                await merchantService.publishOrdersGateway(content);
                                break;
                            default:
                                break;
                        }
                        channel.ack(msg);
                    } catch (err) {
                        console.error(`Error in [${queue.name}]:`, err);
                        channel.nack(msg, false, false);
                    }
                }, { noAck: false });
                console.log(`Consumer ready: ${queue.name}`);
            }
        }
    })
    await consumeChannel.waitForConnect();
    console.log('All consumers started');
}

module.exports = { startConsumers };
