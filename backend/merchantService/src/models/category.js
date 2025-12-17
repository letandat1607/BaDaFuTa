const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const Merchant = require("./merchant.js");

const Category = sequelize.define("Category", {
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
    },
    merchant_id:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: Merchant, key: "id"},
    },
    category_name:{
        type: DataTypes.STRING(100),
        allowNull: false,
    }
},{
    tableName: "category",
    timestamps: false
});

Category.belongsTo(Merchant, {foreignKey: "merchant_id", onDelete: "CASCADE"});
Merchant.hasMany(Category, {foreignKey: "merchant_id"});

module.exports = Category;