module.exports = (sequelize) => {
    const { Merchant, Category, MenuItem, MenuItemOption, Option, OptionItem } = sequelize.models;

    Category.belongsTo(Merchant, { foreignKey: "merchant_id", onDelete: "CASCADE" });
    Merchant.hasMany(Category, { foreignKey: "merchant_id" });

    MenuItem.belongsTo(Merchant, { foreignKey: "merchant_id", onDelete: "CASCADE" });
    Merchant.hasMany(MenuItem, { foreignKey: "merchant_id" });

    MenuItem.belongsTo(Category, { foreignKey: "category_id", onDelete: "SET NULL" });
    Category.hasMany(MenuItem, { foreignKey: "category_id", as: "menu_items" });

    Option.belongsTo(Merchant, { foreignKey: "merchant_id", onDelete: "CASCADE" });
    Merchant.hasMany(Option, { foreignKey: "merchant_id", as: "options" });

    OptionItem.belongsTo(Option, { foreignKey: "option_id", onDelete: "CASCADE", as: 'options' });
    Option.hasMany(OptionItem, { foreignKey: "option_id", as: `option_items` });

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
}