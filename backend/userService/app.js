const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const app = express();
const { sequelize, connectDB } = require("./db");
const { registerUser, signInUser, updateProfile, createLocation } = require("./src/controllers/userController");
const { authenticate } = require("./src/helpers/middleware");

const start = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log("All models were synchronized successfully.");
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", registerUser);
app.post("/login", signInUser);
app.post("/updateProfile", authenticate, updateProfile);
app.post("/createLocation", authenticate, createLocation);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.userServicePORT || 3001;
  
  app.listen(PORT, async () => {
    await start();
    console.log(`API UserService running on port ${PORT}`);
  });
}