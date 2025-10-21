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
// OrderItem.belongsToMany(OptionItem, {through: OrderItemOption, foreignKey: "order_item_id", onDelete: "CASCADE"});
// OptionItem.belongsToMany(OrderItem, {through: OrderItemOption, foreignKey: "option_item_id", onDelete: "CASCADE"});

// OrderItemOption.sync({ alter: true }) // 👈 Tạo bảng nếu chưa có, cập nhật nếu có
//   .then(() => console.log(" Table 'OrderItemOption' synced successfully"))
//   .catch(err => console.error(" Error syncing OrderItemOption table:", err));

module.exports = OrderItemOption;