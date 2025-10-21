// const { DataTypes } = require("sequelize");
// const {sequelize} = require("../../db");
// const User = require("./users");
// const Role = require("./roles");

// const UserRole = sequelize.define("UserRole", {
//   user_id: {
//     type: DataTypes.UUID,
//     references: { model: User, key: "id" },
//     primaryKey: true,
//   },
//   role_id: {
//     type: DataTypes.UUID,
//     references: { model: Role, key: "id" },
//     primaryKey: true,
//   }
// }, {
//   tableName: "user_roles",
//   timestamps: false
// });


// User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id", onDelete: "CASCADE" });
// Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id", onDelete: "CASCADE" });

// UserRole.sync({ alter: true }) // 👈 Tạo bảng nếu chưa có, cập nhật nếu có
//   .then(() => console.log(" Table 'UserRole' synced successfully"))
//   .catch(err => console.error(" Error syncing UserRole table:", err));

// module.exports = UserRole;
