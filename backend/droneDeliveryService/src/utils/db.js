const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });
const { Sequelize } = require("sequelize");

const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_DRONE_DELIVERY;

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database drone_delivery_service_db connected");
  } catch (error) {
    console.error("Unable to connect to the database drone_delivery_service_db :", error);
  }
};

module.exports = { sequelize, connectDB };