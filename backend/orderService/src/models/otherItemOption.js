const {DataTypes} = require("sequelize");
const {sequelize} = require("../utils/db");
const OrderItem = require("./orderItem.js");

const OrderItemOption = sequelize.define("OrderItemOption", {
        order_item_id:{
            type: DataTypes.UUID,
            allowNull: false,
            references: {model: OrderItem, key: "id"},
            primaryKey: true,
        },
        option_item_id:{
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        }
    },{
        tableName: "order_item_option",
        timestamps: false
    }
);

// OrderItem.hasMany(OrderItemOption, { foreignKey: "order_item_id", as: "options", onDelete: "CASCADE" });
// OrderItemOption.belongsTo(OrderItem, { foreignKey: "order_item_id", onDelete: "CASCADE" });

module.exports = OrderItemOption;