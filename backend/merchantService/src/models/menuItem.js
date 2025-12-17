const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const Merchant = require("./merchant");
const Category = require("./category");

const MenuItem = sequelize.define("MenuItem", {
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
    },
    merchant_id:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: Merchant, key: "id"},
    },
    category_id:{
        type: DataTypes.UUID,
        references: {model: Category, key: "id"},
    },
    name_item:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    price:{
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    likes:{
        type: DataTypes.BIGINT,
    },
    sold_count: {
        type: DataTypes.BIGINT,
    },
    description: {
        type: DataTypes.STRING,
    },
    image_item: {
        type: DataTypes.JSONB,
    },
    status:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
},{
    tableName: "menu_item",
    timestamps: false,      
});

// MenuItem.belongsTo(Merchant, {foreignKey: "merchant_id", onDelete: "CASCADE"});
// Merchant.hasMany(MenuItem, {foreignKey: "merchant_id"});

// MenuItem.belongsTo(Category, {foreignKey: "category_id", onDelete: "SET NULL"});
// Category.hasMany(MenuItem, {foreignKey: "category_id", as: "menu_items"});

module.exports = MenuItem;