//OrderService
// module.exports.rabbitConfig = {
//     exchanges: [
//         { name: "order_exchange", type: "topic" },
//         { name: "payment_exchange", type: "topic" },
//         { name: "merchant_exchange", type: "topic" },
//     ],
//     queues: [
//         { name: "order_payment_queue", bindingKey: "payment.order.completed", exchange: "payment_exchange" },//đợi tín hiệu complete từ payment để cập nhật database
//         { name: "order_payment_failed_queue", bindingKey: "payment.order.failed", exchange: "payment_exchange" },
//         { name: "order_status_queue", bindingKey: "merchant.order.status", exchange: "merchant_exchange" },//đợi yêu cầu cập nhật status từ phía merchant
//     ],
// };

// //PaymentService
// module.exports.rabbitConfig = {
//     exchanges: [
//         { name: "payment_exchange", type: "topic" },
//         { name: "order_exchange", type: "topic" },
//     ],
//     queues: [
//         { name: "payment_order_queue", bindingKey: "order.payment.process", exchange: "order_exchange" },
//     ],
// };

//MerchantService
module.exports.rabbitConfig = {
    exchanges: [
        { name: "merchant_exchange", type: "topic" },
        { name: "order_exchange", type: "topic" },
    ],
    queues: [
        { name: "merchant_order_queue", bindingKey: "order.merchant.confirmed", exchange: "order_exchange" },
        { name: "merchant_order_status_queue", bindingKey: "order.status.updated", exchange: "order_exchange" },
        { name: "merchant_orders_queue", bindingKey: "order.merchant.send_all", exchange: "order_exchange" },   
    ],
};

// //Gateway
// module.exports.rabbitConfig = {
//     exchanges: [
//         { name: "order_exchange", type: "topic" },
//         { name: "merchant_exchange", type: "topic" },
//     ],
//     queues: [
//         { name: "gateway_order_queue", bindingKey: "merchant.gateway.new_order", exchange: "merchant_exchange" },
//         { name: "gateway_order_update_queue", bindingKey: "order.status.updated", exchange: "order_exchange" },
//     ]
// }