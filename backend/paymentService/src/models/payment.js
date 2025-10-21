const { DataTypes } = require("sequelize");
const { sequelize } = require("../untils/db")

const Payment = sequelize.define("Payment", {
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
    },
    user_id:{
        type: DataTypes.UUID,
        allowNull: false,
    },
    merchant_id:{
        type: DataTypes.UUID,
        allowNull: false,
    },
    order_id:{
        type: DataTypes.UUID,
        allowNull: false,
    },
    amount:{
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    currency:{//don vi tien te
        type: DataTypes.STRING,
        allowNull: false,
    },
    transaction_code:{
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
    },
    payment_method:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    tableName: "payment",
    timestamps: true,      
    createdAt: "created_at",
    updatedAt: "updated_at",
});

Payment.sync({ alter: true }) // 👈 Tạo bảng nếu chưa có, cập nhật nếu có
  .then(() => console.log(" Table 'Payment' synced successfully"))
  .catch(err => console.error(" Error syncing Payment table:", err));

module.exports = Payment;