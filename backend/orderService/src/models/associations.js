module.exports = (sequelize) => {
    const { Order, OrderItem, OrderItemOption } = sequelize.models;

    Order.hasMany(OrderItem, { foreignKey: "order_id", as: "order_items", onDelete: "CASCADE" });
    OrderItem.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });

    OrderItem.hasMany(OrderItemOption, { foreignKey: "order_item_id", as: "options", onDelete: "CASCADE" });
    OrderItemOption.belongsTo(OrderItem, { foreignKey: "order_item_id", onDelete: "CASCADE" });
};