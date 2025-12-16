const { connectRabbitMQ } = require("./rabbitConnect");
const { rabbitConfig } = require("./rabbitConfig");
const orderService = require("../services/orderService");

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
                            case 'payment.order.completed':
                                console.log('Processing payment.order.completed:', content);
                                await orderService.updateOrderStatusPayment(content.orderId, content.statusPayment);
                                await orderService.publishOrderMerchant(content.orderId);
                                break;
                            case 'payment.order.failed':
                                await orderService.updateOrderStatusPayment(content.orderId, content.statusPayment);
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
