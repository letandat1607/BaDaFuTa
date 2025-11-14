const { Cart, CartItem, CartItemOption, Order, OrderItem, OrderItemOption } = require("../models/index");

module.exports.getUserOrders = async (userId) => {
    return await Order.findAll({
        where: {user_id: userId},
        include: [
          {
            model: OrderItem,
            as:"order_items",
            include: [
              {
                model: OrderItemOption,
                as:"options",
              }
            ]
          }
        ]
    });
}

module.exports.getOneOrder = async (orderId) => {
  return await Order.findOne({
    where: {id: orderId},
    include: [
      {
        model: OrderItem,
        as: "order_items",
        include: [
          {
            model: OrderItemOption,
            as: "options"
          }
        ]
      }
    ]
  });
}


module.exports.createOrder = async (data, transaction) => {
    return await Order.create(data, {transaction});
}

module.exports.createOderItem = async (data, transaction) => {
    return await OrderItem.create(data, {transaction});
}

module.exports.createOderItemOption = async (data, transaction) => {
    return await OrderItemOption.create(data, {transaction});
}

module.exports.updateField = async (orderID, data) => {
    const order = await Order.findByPk(orderID);
    if(!order) return null;

    await order.update(data);
    return order;
}

/////////////////////////////////////////////////////////////////////////////
module.exports.getAllOrderMerchant = async (merchant_id) => {
  const orderss = await Order.findAll({
    where: {merchant_id},
    include: [
      {
        model: OrderItem,
        as:"order_items",
        include: [
          {
            model: OrderItemOption,
            as:"options",
          }
        ]
      }
    ]
  });
  return orderss;
}

// module.exports.updateCategory = async (id, data) => {
//   const it = await Category.findByPk(id);
//   if (!it) return null;
//   if (!data) return it;
//   await it.update(data);
//   return it;
// }