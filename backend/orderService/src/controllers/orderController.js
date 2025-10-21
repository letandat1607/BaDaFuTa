const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });
const { Cart, CartItem, CartItemOption, Order, OrderItem, OrderItemOption } = require("../models/index");
const {sequelize} = require("../utils/db");
const { v4 } = require("uuid");

module.exports.getAllOrder = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Người dùng chưa đăng nhập" });

    const orders = await Order.findAll({
      where: { user_id: user.id },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: OrderItemOption
            }
          ]
        }
      ]
    });
    return res.json({ orders });
  } catch (err) {
    console.log("orderController getAllOrder error", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports.checkOutOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const order = req.body;
    // console.log(req.body);
    // const user = req.user;

    const newOrder = await Order.create(
      {
        id: v4(),
        merchant_id: order.merchant_id,
        user_id: order.user_id,
        full_name: order.full_name,
        phone: order.phone,
        delivery_address: order.delivery_address,
        delivery_fee: order.delivery_fee,
        note: order.note || null,
        payment_method: order.method,
        total_amount: order.total_amount,
        status: "PENDING",
        method: order.method,
      },
      { transaction: transaction }
    );

    for (const item of order.order_items) {
      const newOrderItem = await OrderItem.create(
        {
          id: v4(),
          order_id: newOrder.id,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price: item.price,
          note: item.note || null,
        },
        { transaction: transaction }
      );
      if (item.options && item.options.length > 0) {
        for (const opt of item.options) {
          await OrderItemOption.create(
            {
              id: v4(),
              order_item_id: newOrderItem.id,
              option_item_id: opt.option_item_id,
            },
            { transaction: transaction }
          );
        }
      }
    }
    await transaction.commit();

    const paymentRes = await fetch(`${process.env.GATEWAY_URL}/api/payment/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: order.method,
        totalAmount: order.total_amount,
        orderID: newOrder.id,
        userID: order.userID
      }),
    });

    const {payUrl} = await paymentRes.json();
    console.log("data: ", payUrl);
    return res.status(201).json({
      message: "Order created successfully",
      payUrl,
      order_id: newOrder.id,
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error("Error in checkout:", err);

    return res.status(500).json({
      message: "Failed to create order",
      error: err.message,
    });
  }
};

module.exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, orderID } = req.body;

    if (!orderID || !status) {
      return res.status(400).json({ message: "Thiếu orderID hoặc status" });
    }

    const order = await Order.findOne({ where: { id: orderID } });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order_id: order.id,
      new_status: order.status,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái order:", err);
    return res.status(500).json({ message: "Lỗi server khi cập nhật đơn hàng" });
  }
}