//PaymentService
module.exports.rabbitConfig = {
    exchanges: [
        { name: "payment_exchange", type: "topic" },
        { name: "order_exchange", type: "topic" },
    ],
    queues: [
        { name: "payment_order_queue", bindingKey: "order.payment.process", exchange: "order_exchange" },
    ],
};
