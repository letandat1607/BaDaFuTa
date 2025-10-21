const {DataTypes} = require("sequelize");
const {sequelize} = require("../utils/db.js");
const CartItem = require("./cartItem.js");



const CartItemOption = sequelize.define("CartItemOption", {
        cart_item_id:{
            type: DataTypes.UUID,
            allowNull: false,
            references: {model: CartItem, key: "id"},
            primaryKey: true,
        },
        option_item_id:{
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        }
    },{
        tableName: "cart_item_option",
        timestamps: false
    }
);
// CartItem.belongsToMany(OptionItem, {through: CartItemOption, foreignKey: "cart_item_id", onDelete: "CASCADE"});
// OptionItem.belongsToMany(CartItem, {through: CartItemOption, foreignKey: "option_item_id", onDelete: "CASCADE"});

// CartItemOption.sync({ alter: true }) // 👈 Tạo bảng nếu chưa có, cập nhật nếu có
//   .then(() => console.log(" Table 'CartItemOption' synced successfully"))
//   .catch(err => console.error(" Error syncing CartItemOption table:", err));

module.exports = CartItemOption;