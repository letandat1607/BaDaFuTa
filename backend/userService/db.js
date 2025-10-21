// require("dotenv").config({ path: "../.env" });

// const { Pool } = require("pg");

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL_USER,
// });

// const createTables = async () => {
//   try {
//     await pool.query(`
    // CREATE TABLE IF NOT EXISTS users (
    //     id VARCHAR(255) PRIMARY KEY,
    //     user_name VARCHAR(255) NOT NULL,
    //     full_name VARCHAR(100) NOT NULL,
    //     email VARCHAR(255) UNIQUE NOT NULL,
    //     phone_number VARCHAR(20),
    //     password VARCHAR(255),
    //     image VARCHAR(255),
    //     created_at TIMESTAMP DEFAULT NOW(),
    //     updated_at TIMESTAMP DEFAULT NOW()
    // );

    // CREATE TABLE IF NOT EXISTS roles (
    //     id VARCHAR(255) PRIMARY KEY,
    //     role_name VARCHAR(50) UNIQUE NOT NULL
    // );

    // CREATE TABLE IF NOT EXISTS addresses (
    //     id VARCHAR(255) PRIMARY KEY,
    //     user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    //     label VARCHAR(50),
    //     geometry JSONB,
    //     full_address VARCHAR(255)
    // );

    // CREATE TABLE IF NOT EXISTS user_roles (
    //     user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    //     role_id VARCHAR(255) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    //     PRIMARY KEY (user_id, role_id)
    // );
//     `);
//     console.log("✅ Tables checked/created successfully.");
//   } catch (error) {
//     console.error("❌ Error creating tables:", error);
//   }
// };

// module.exports = {
//   query: (text, params) => {
//     return pool.query(text, params);
//   },
//   createTables,
// };

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL_USER, {
  dialect: "postgres",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected with Sequelize...");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };
