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

Order.hasMany(OrderItem, { foreignKey: "order_id", as: "order_items", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });

module.exports = OrderItem;