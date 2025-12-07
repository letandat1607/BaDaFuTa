const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });
const { sequelize } = require("../utils/db");
const { v4 } = require("uuid");
const orderRepo = require('../repositories/orderRepository');
const { publishMsg } = require('../rabbitMQ/rabbitFunction');
const { validateOrder } = require('../grpc/merchantClient');
const orderSchema = require("../validations/orderValidation");
const orderItemValidation = require("../validations/orderItemValidation");

module.exports.getUserOrders = async (userId) => {
    const orders = await orderRepo.getUserOrders(userId);
    return await publishMsg({ userId, orders }, "order_exchange", "order.merchant.send_all");
}

module.exports.getOrder = async (orderId, userId) => {
    const order = await orderRepo.getOneOrder(orderId, userId);
    // console.log(order);
    await publishMsg({ userId: order.user_id, order }, "order_exchange", "order.merchant.confirmed");
    return order;
}

module.exports.createOrder = async (data, userId) => {
    const transaction = await sequelize.transaction();
    try {
        console.log("Create order service data:", data);

        const { value, error } = orderSchema.validate({status: "waiting", ...data}, {stripUnknown: true});
        if (error) throw new Error('Đơn hàng không hợp lệ');

        const { server_total } = await validateOrder(data);
        console.log("server_total:", server_total, "client_total:", data.total_amount);
        if (Number(server_total) !== Number(data.total_amount)) {
            throw new Error("Tổng tiền không hợp lệ");
        }
        let dataOrder = data || null;
        if (data.order_id) {
            const existingOrderUser = await orderRepo.getOneOrderPayment(data.order_id, userId);
            if (!existingOrderUser) {
                throw new Error("Đơn hàng không tồn tại hoặc đã được thanh toán");
            }
            dataOrder = existingOrderUser;
        }
        else {
            const newOrder = await orderRepo.createOrder(
                {
                    id: v4(),
                    ...value,
                    status_payment: "pending",
                },
                transaction
            );

            for (const item of data.order_items) {
                const { value: itemValue, error: itemError } = orderItemValidation.validate({order_id: newOrder.id, ...item}, { stripUnknown: true });
                if (itemError) throw new Error(itemError.message);
                const newOrderItem = await orderRepo.createOderItem(
                    {
                        id: v4(),
                        ...itemValue,
                    },
                    transaction
                );

                if (item.options && Array.isArray(item.options)) {
                    for (const group of item.options) {
                        if (group.items && Array.isArray(group.items)) {
                            for (const opt of group.items) {
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
                            }
                        }
                    }
                }
            }
            await transaction.commit();
            dataOrder = newOrder;
        }
        if (!dataOrder.id) {
            throw new Error("Tạo đơn hàng thất bại");
        }

        const payload = {
            order_id: dataOrder.id,
            user_id: dataOrder.user_id,
            merchant_id: dataOrder.merchant_id,
            total_amount: dataOrder.total_amount,
            method: dataOrder.method,
            created_at: new Date(),
        };

        await publishMsg(payload, "order_exchange", "order.payment.process");
        return dataOrder;
    } catch (err) {
        await transaction.rollback();
        throw err;
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
        await publishMsg({ location, order, droneId: data.drone_id }, "order_exchange", "order.status.updated");
        await publishMsg({ droneId: data.drone_id, status: "DELIVERING", orderId }, "order_exchange", "order.drone.delivery_status");
    } else if (data.status === "complete") {
        await publishMsg({ droneId: data.drone_id || null, status: "READY", orderId }, "order_exchange", "order.drone.delivery_status");
        await publishMsg(order, "order_exchange", "order.status.updated");
    } else {
        await publishMsg(order, "order_exchange", "order.status.updated");
    }

    return order;
}