const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const MenuItem = require("./menuItem");
const Option = require("./option");

const MenuItemOption = sequelize.define("MenuItemOption", {
    menu_item_id:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: MenuItem, key: "id"},
        primaryKey: true,
    },
    option_id:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: Option, key: "id"},
        primaryKey: true,
    }
},{
    tableName: "menu_item_option",
    timestamps: false
});

Option.belongsToMany(MenuItem, {through: MenuItemOption, foreignKey: "option_id", onDelete: "CASCADE"});
MenuItem.belongsToMany(Option, {through: MenuItemOption, foreignKey: "menu_item_id", onDelete: "CASCADE"});

// MenuItemOption.sync({ alter: true }) // 👈 Tạo bảng nếu chưa có, cập nhật nếu có
//   .then(() => console.log(" Table 'MenuItemOption' synced successfully"))
//   .catch(err => console.error(" Error syncing MenuItemOption table:", err));

module.exports = MenuItemOption;