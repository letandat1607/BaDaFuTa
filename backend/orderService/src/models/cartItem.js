const {DataTypes} = require("sequelize");
const {sequelize} = require("../utils/db")
const Cart = require("./cart.js");

const CartItem = sequelize.define("CartItem", {
        id:{
            type: DataTypes.UUID,
            primaryKey: true,
        },
        cart_id:{
            type: DataTypes.UUID,
            allowNull: false,
            references: {model: Cart, key: "id"},
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
        tableName: "cart_item",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);
CartItem.belongsTo(Cart, {foreignKey: "cart_id", onDelete: "CASCADE"});
Cart.hasMany(CartItem, {foreignKey: "cart_id"});

// CartItem.belongsTo(MenuItem, {foreignKey: "menu_item_id", onDelete: "SET NULL"});
// MenuItem.hasMany(CartItem, {foreignKey: "menu_item_id"});

// CartItem.sync({ alter: true }) // 👈 Tạo bảng nếu chưa có, cập nhật nếu có
//   .then(() => console.log(" Table 'CartItem' synced successfully"))
//   .catch(err => console.error(" Error syncing CartItem table:", err));

module.exports = CartItem;