//OrderService
module.exports.rabbitConfig = {
    exchanges: [
        { name: "order_exchange", type: "topic" },
        { name: "payment_exchange", type: "topic" },
        { name: "merchant_exchange", type: "topic" },
    ],
    queues: [
        { name: "order_payment_queue", bindingKey: "payment.order.completed", exchange: "payment_exchange" },//đợi tín hiệu complete từ payment để cập nhật database
        { name: "order_payment_failed_queue", bindingKey: "payment.order.failed", exchange: "payment_exchange" },
        { name: "order_status_queue", bindingKey: "merchant.order.status", exchange: "merchant_exchange" },//đợi yêu cầu cập nhật status từ phía merchant
    ],
};
