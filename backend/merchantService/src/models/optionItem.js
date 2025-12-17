const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const Option = require("./option")

const OptionItem = sequelize.define("OptionItem", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    option_id: {
        type: DataTypes.UUID,
        references: { model: Option, key: "id" },
        allowNull: false
    },
    option_item_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    price: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status_select: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

}, {
    tableName: "option_item",
    timestamps: false
});



// OptionItem.belongsTo(Option, { foreignKey: "option_id", onDelete: "CASCADE", as: 'options' });
// Option.hasMany(OptionItem, { foreignKey: "option_id", as: `option_items` });


module.exports = OptionItem;