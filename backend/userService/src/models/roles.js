// const { DataTypes } = require("sequelize");
// const {sequelize} = require("../../db");

// const Role = sequelize.define("Role", {
//     id: {
//       type: DataTypes.UUID,
//       primaryKey: true
//     },
//     role_name: {
//       type: DataTypes.STRING(50),
//       unique: true,
//       allowNull: false
//     }
//   }, {
//     tableName: "roles",
//     timestamps: false
// });

// Role.sync({ alter: true }) // 👈 Tạo bảng nếu chưa có, cập nhật nếu có
//   .then(() => console.log(" Table 'Role' synced successfully"))
//   .catch(err => console.error(" Error syncing Role table:", err));

// module.exports = Role;
