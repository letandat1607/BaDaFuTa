const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const MenuItem = require("./menuItem");
const Option = require("./option");

const MenuItemOption = sequelize.define("MenuItemOption", {
  menu_item_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  option_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  }
}, {
  tableName: "menu_item_option",
  timestamps: false
});


Option.belongsToMany(MenuItem, {
  through: MenuItemOption,
  foreignKey: "option_id",
  as: "option_menu_items",
  onDelete: "CASCADE"
});


MenuItem.belongsToMany(Option, {
  through: MenuItemOption,
  foreignKey: "menu_item_id",
  as: "options",
  onDelete: "CASCADE"
});

// MenuItemOption.belongsTo(MenuItem, {
//   foreignKey: "menu_item_id",
//   as: "menu_item"
// });

// MenuItemOption.belongsTo(Option, {
//   foreignKey: "option_id",
//   as: "option"
// });


module.exports = MenuItemOption;