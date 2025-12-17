const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const Merchant = require("./merchant");

const Option = sequelize.define("Option",{
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
    },
    
    merchant_id:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {model: Merchant, key: "id"},
    },
    option_name:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    multi_select:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    require_select: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    number_select:{
        type: DataTypes.BIGINT,
        defaultValue: 0
    }
},{
    tableName: "option",
    timestamps: false
});


// Option.belongsTo(Merchant, {foreignKey: "merchant_id", onDelete: "CASCADE"});
// Merchant.hasMany(Option, {foreignKey: "merchant_id", as: "options"});

module.exports = Option;