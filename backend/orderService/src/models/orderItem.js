const {DataTypes} = require("sequelize");
const {sequelize} = require("../utils/db")
const Order = require("./order.js");

const OrderItem = sequelize.define("OrderItem", {
        id:{
            type: DataTypes.UUID,
            primaryKey: true,
        },
        order_id:{
            type: DataTypes.UUID,
            allowNull: false,
            references: {model: Order, key: "id"},
        },
        menu_item_id:{
            type: DataTypes.UUID,
            allowNull: false,
        },
        note:{
            type: DataTypes.STRING,
            allowNull: true
        },
        quantity: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        price:{
            type: DataTypes.BIGINT,
            allowNull: false
        }
    },
    {
        tableName: "order_item",
        timestamps: false,
    }
);
OrderItem.belongsTo(Order, {foreignKey: "order_id", onDelete: "CASCADE"});
Order.hasMany(OrderItem, {foreignKey: "order_id"});

// OrderItem.belongsTo(MenuItem, {foreignKey: "menu_item_id", onDelete: "SET NULL"});
// MenuItem.hasMany(OrderItem, {foreignKey: "menu_item_id"});

// OrderItem.sync({ alter: true }) // 👈 Tạo bảng nếu chưa có, cập nhật nếu có
//   .then(() => console.log(" Table 'OrderItem' synced successfully"))
//   .catch(err => console.error(" Error syncing OrderItem table:", err));

module.exports = OrderItem;