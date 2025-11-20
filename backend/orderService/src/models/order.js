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
            type: DataTypes.JSONB,
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
        status_payment:{
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

module.exports = Order;