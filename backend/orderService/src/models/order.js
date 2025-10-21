const {DataTypes} = require("sequelize");
const {sequelize} = require("../utils/db");


const Order = sequelize.define("Order", {
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
        full_name:{
            type: DataTypes.STRING(100),
            allowNull: false
        },
        note:{
            type: DataTypes.STRING,
            allowNull: true
        },
        phone:{
            type: DataTypes.STRING(20),
            allowNull: false
        },
        delivery_address:{
            type: DataTypes.STRING,
            allowNull: false
        },
        delivery_fee:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        total_amount:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false
        },
        method:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
    tableName: "order",
    timestamps: true,      
    createdAt: "created_at",
    updatedAt: "updated_at",
    }
);
// Order.belongsTo(Merchant, {foreignKey: "merchant_id", onDelete: "SET NULL"});
// Merchant.hasMany(Order, {foreignKey: "merchant_id"});

// Order.belongsTo(User, {foreignKey: "user_id", onDelete: "SET NULL"});
// User.hasMany(Order, {foreignKey: "user_id"});

// Order.sync({ alter: true }) // 👈 Tạo bảng nếu chưa có, cập nhật nếu có
//   .then(() => console.log(" Table 'Order' synced successfully"))
//   .catch(err => console.error(" Error syncing Order table:", err));

module.exports = Order;