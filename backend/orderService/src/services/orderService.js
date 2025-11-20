const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });
const { sequelize } = require("../utils/db");
const { v4 } = require("uuid");
const orderRepo = require('../repositories/orderRepository');
const { publishMsg } = require('../rabbitMQ/rabbitFunction');

module.exports.getUserOrders = async (userId) => {
    const orders = await orderRepo.getUserOrders(userId);
    return await publishMsg({userId, orders}, "order_exchange", "order.merchant.send_all");
}

module.exports.getOrder = async (orderId) => {
    const order = await orderRepo.getOneOrder(orderId);
    // console.log(order);
    return await publishMsg({userId: order.user_id, order}, "order_exchange", "order.merchant.confirmed")
}

module.exports.createOrder = async (order, userId) => {
    const transaction = await sequelize.transaction();
    try {
        const newOrder = await orderRepo.createOrder(
            {
                id: v4(),
                merchant_id: order.merchant_id,
                user_id: userId,
                full_name: order.full_name,
                phone: order.phone,
                delivery_address: order.delivery_address,
                delivery_fee: order.delivery_fee,
                note: order.note || null,
                payment_method: order.method,
                total_amount: order.total_amount,
                status_payment: "pending",
                status: "waiting",
                method: order.method,
            },
            transaction
        );

        // for (const item of order.order_items) {
        //     const newOrderItem = await orderRepo.createOderItem(
        //         {
        //             id: v4(),
        //             order_id: newOrder.id,
        //             menu_item_id: item.menu_item_id,
        //             quantity: item.quantity,
        //             price: item.price,
        //             note: item.note || null,
        //         },
        //         transaction 
        //     );
        //     console.log("new items done");
        //     if (item.options && item.options.length > 0) {
        //         for (const opt of item.options.items) {
        //             await orderRepo.createOderItemOption(
        //                 {
        //                     id: v4(),
        //                     order_item_id: newOrderItem.id,
        //                     option_item_id: opt.option_item_id,
        //                 },
        //                 transaction
        //             );
        //             console.log("new op done");
        //         }
        //     }
        // }

        for (const item of order.order_items) {
            console.log("newOrderItem:", {
                id: v4(),
                order_id: newOrder.id,
                menu_item_id: item.menu_item_id,
                quantity: item.quantity,
                price: item.price,
                note: item.note.length > 0 ? item.note : null,
            })
            const newOrderItem = await orderRepo.createOderItem(
                {
                    id: v4(),
                    order_id: newOrder.id,
                    menu_item_id: item.menu_item_id,
                    quantity: item.quantity,
                    price: item.price,
                    note: item.note.length > 0 ? item.note : null,
                },
                transaction
            );
            // console.log(newOrderItem)
            console.log("new item done");

            if (item.options && Array.isArray(item.options)) {
                for (const group of item.options) {
                    if (group.items && Array.isArray(group.items)) {
                        for (const opt of group.items) {
                            console.log("do đc items:", opt)
                            if (!opt.option_item_id) {
                                console.warn("Missing option_item_id:", opt);
                                continue;
                            }

                            await orderRepo.createOderItemOption(
                                {
                                    order_item_id: newOrderItem.id,
                                    option_item_id: opt.option_item_id,
                                },
                                transaction
                            );
                            console.log("new option done");
                        }
                    }
                }
            }
        }

        console.log("all done")
        await transaction.commit();

        const payload = {
            order_id: newOrder.id,
            user_id: newOrder.user_id,
            merchant_id: newOrder.merchant_id,
            total_amount: newOrder.total_amount,
            method: newOrder.method,
            created_at: new Date(),
        };

        await publishMsg(payload, "order_exchange", "order.payment.process");
        return newOrder;

    } catch (err) {
        await transaction.rollback();
        console.log("orderService checkOutDer err ")
        console.log(err);
    }
}

module.exports.updateOrderStatusPayment = async (orderId, statusPayment) => {
    const orderExists = await orderRepo.updateField(orderId, { status_payment: statusPayment });
    if (!orderExists) throw new Error('Không tìm thấy đơn hàng');

    return orderExists;
}

module.exports.publishOrderMerchant = async (orderId) => {
    const order = await orderRepo.getOneOrder(orderId);
    if (!order) throw new Error('Không tìm thấy đơn hàng');

    console.log("Oder publish merchant: ", order);

    await publishMsg(order, "order_exchange", "order.merchant.confirmed");
}


module.exports.updateOrderStatus = async (orderId, status) => {
    const order = await orderRepo.updateField(orderId, { status: status });
    if (!order) throw new Error('Không tìm thấy đơn hàng');

    return order;
}

///////////////////////////////////////////////////////////////////////////////
module.exports.getAllOrderMerchant = async (merchant_id) => {
    if (!merchant_id) throw new Error("Thiếu merchant_id");
    const orders = await orderRepo.getAllOrderMerchant(merchant_id);

    return await publishMsg({ orders, merchantId: merchant_id }, "order_exchange", "order.merchant.send_all");
};

module.exports.updateOrder = async (orderId, data, location) => {
    console.log("updateOrder service:", { orderId, data });
    const order = await orderRepo.updateField(orderId, data);
    if (!order) throw new Error('Không tìm thấy đơn hàng');
    
    if (data.status === "delivering") {
        await publishMsg({location, order, droneId: data.drone_id}, "order_exchange", "order.status.updated");
        await publishMsg({droneId: data.drone_id, status: "DELIVERING", orderId}, "order_exchange", "order.drone.delivery_status");
    }else if(data.status === "complete"){
        await publishMsg({droneId: data.drone_id || null, status: "READY", orderId}, "order_exchange", "order.drone.delivery_status");
        await publishMsg(order, "order_exchange", "order.status.updated");
    }else{
        await publishMsg(order, "order_exchange", "order.status.updated");
    }

    return order;
}