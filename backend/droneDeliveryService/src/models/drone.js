const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

const Drone = sequelize.define("Drone", {
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
    },
    merchant_id:{
        type: DataTypes.UUID,
        allowNull: false,
    },
    order_id:{
        type: DataTypes.UUID,
        allowNull: true,
    },
    drone_name:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    current_location:{
        type: DataTypes.JSONB,
        allowNull: false,
    },
    status:{
        type: DataTypes.STRING,
        defaultValue: "OFFLINE",
    }
},{
    tableName: "drone", 
    timestamps: true,      
    createdAt: "created_at", 
    updatedAt: "updated_at"  
});

Drone.sync({ alter: true }) // 👈 Tạo bảng nếu chưa có, cập nhật nếu có
  .then(() => console.log(" Table 'Drone' synced successfully"))
  .catch(err => console.error(" Error syncing Drone table:", err));

module.exports = Drone;