//Gateway
module.exports.rabbitConfig = {
    exchanges: [
        { name: "order_exchange", type: "topic" },
        { name: "merchant_exchange", type: "topic" },
        { name: "payment_exchange", type: "topic" },
    ],
    queues: [
        { name: "gateway_order_queue", bindingKey: "merchant.gateway.new_order", exchange: "merchant_exchange" },
        { name: "gateway_orders_queue", bindingKey: "merchant.gateway.orders", exchange: "merchant_exchange" },
        { name: "gateway_payment_queue", bindingKey: "payment.gateway.payment_qr", exchange: "payment_exchange" },
        { name: "gateway_order_update_queue", bindingKey: "order.status.updated", exchange: "order_exchange" },
        { name: "gateway_payment_completed_queue", bindingKey: "payment.order.completed", exchange: "payment_exchange" },
        { name: "gateway_payment_failed_queue", bindingKey: "payment.order.failed", exchange: "payment_exchange" },
    ]
}