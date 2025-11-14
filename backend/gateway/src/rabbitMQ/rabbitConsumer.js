const { connectRabbitMQ } = require("./rabbitConnect");
const { rabbitConfig } = require("./rabbitConfig");

let consumeChannel = null;
async function startConsumers(gatewayService) {
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
                            case "merchant.gateway.new_order":
                                // console.log(content);
                                if(content.userId){
                                    await gatewayService.pushOrderUI(content.order[0], content.userId);
                                }else{
                                    await gatewayService.pushOrderUI(content[0]);
                                }
                                break;
                            case "payment.gateway.payment_qr":
                                await gatewayService.pushPaymentQR(content);
                                break;
                            case "payment.order.completed":
                                await gatewayService.pushPaymentSuccess(content);
                                break;
                            case "payment.order.failed":
                                await gatewayService.pushPaymentFailed(content);
                                break;
                            case "order.status.updated":
                                await gatewayService.pushOrderStatusUI(content)
                                break;
                            case "merchant.gateway.orders":
                                await gatewayService.pushOrdersUI(content)
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
