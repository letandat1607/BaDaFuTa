const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL_ORDER, {
  dialect: "postgres",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database order_service_db connected");
  } catch (error) {
    console.error("❌ Unable to connect to the database order_service_db :", error);
  }
};

module.exports = { sequelize, connectDB };