const { DataTypes } = require("sequelize");
const {sequelize} = require("../../db");
const User = require("./users")

const Address = sequelize.define("Address", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    references: { model: User, key: "id" }
  },
  label: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  geometry: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  full_address: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "addresses",
  timestamps: false
});

Address.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Address, { foreignKey: "user_id" });

// Address.sync({ alter: true }) // 👈 Tạo bảng nếu chưa có, cập nhật nếu có
//   .then(() => console.log(" Table 'Address' synced successfully"))
//   .catch(err => console.error(" Error syncing Address table:", err));

module.exports = Address;
