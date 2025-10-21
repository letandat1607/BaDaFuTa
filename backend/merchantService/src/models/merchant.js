const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const Merchant = sequelize.define("Merchant", {
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
    },
    user_id:{
        type: DataTypes.UUID,
        allowNull: false,
    },
    merchant_name:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    location:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    phone:{
        type: DataTypes.STRING(20)
    },
    email:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    profile_image:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    cover_image:{
        type: DataTypes.STRING,
    },
    time_open:{
        type: DataTypes.JSONB,
    }
},{
    tableName: "merchant", 
    timestamps: false    
});

// Merchant.sync({ alter: true }) // 👈 Tạo bảng nếu chưa có, cập nhật nếu có
//   .then(() => console.log(" Table 'Merchant' synced successfully"))
//   .catch(err => console.error(" Error syncing Merchant table:", err));

module.exports = Merchant;