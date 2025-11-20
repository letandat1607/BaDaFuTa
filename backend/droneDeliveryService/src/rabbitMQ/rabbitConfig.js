module.exports.rabbitConfig = {
    exchanges: [
        { name: "order_exchange", type: "topic" },
    ],
    queues: [
        { name: "drone_order_queue", bindingKey: "order.drone.delivery_status", exchange: "order_exchange" },
    ]
}

