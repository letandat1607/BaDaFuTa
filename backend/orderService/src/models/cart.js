const {DataTypes} = require("sequelize");
const {sequelize} = require("../utils/db");

const Cart = sequelize.define("Cart", {
        id:{
            type: DataTypes.UUID,
            primaryKey: true
        },
        merchant_id:{
            type: DataTypes.UUID,
            allowNull: false,
        },
        user_id:{
            type: DataTypes.UUID,
            allowNull: false,
        },
        total:{
            type: DataTypes.BIGINT,
            allowNull: false,
        },
       
    },
    {
    tableName: "cart",
    timestamps: true,      
    createdAt: "created_at",
    updatedAt: "updated_at",
    }
);
// Cart.belongsTo(Merchant, {foreignKey: "merchant_id", onDelete: "CASCADE"});
// Merchant.hasMany(Cart, {foreignKey: "merchant_id"});

// Cart.belongsTo(User, {foreignKey: "user_id", onDelete: "CASCADE"});
// User.hasMany(Cart, {foreignKey: "user_id"});

module.exports = Cart;

// Cart.sync({ alter: true }) // 👈 Tạo bảng nếu chưa có, cập nhật nếu có
//   .then(() => console.log(" Table 'Cart' synced successfully"))
//   .catch(err => console.error(" Error syncing Cart table:", err));

