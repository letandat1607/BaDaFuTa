const  Order = require('./order');
const OrderItem = require('./orderItem');
// const OrderItemOption = require('./orderItemOption');


module.exports = () => {
    Order.hasMany(OrderItem, { foreignKey: "order_id", as: "order_items", onDelete: "CASCADE" });
    OrderItem.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });
};