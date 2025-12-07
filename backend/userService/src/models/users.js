const { DataTypes } = require("sequelize");
const { sequelize } = require("../../db");
// const { Role } = require(".");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING(20),
    },
    password: {
        type: DataTypes.STRING,
    },
    role:{
        type: DataTypes.STRING(20),
    },
    image: {
        type: DataTypes.STRING,
    },
    }, {
    tableName: "users",
    freezeTableName: true, 
    timestamps: true,      
    createdAt: "created_at",
    updatedAt: "updated_at",
});

module.exports = User;



