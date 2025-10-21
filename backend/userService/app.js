const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const app = express();
const { sequelize, connectDB } = require("./db");
const PORT = process.env.userServicePORT;
const {createUser, signInUser, updateProfile, createLocation} = require("./src/controllers/userController");
const {authenticate, sendMail} = require("./src/helpers/middleware");

const start = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log("✅ All models were synchronized successfully.");
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/register", createUser);
app.post("/login", signInUser);
app.post("/updateProfile",authenticate, updateProfile);
app.post("/createLocation",authenticate, createLocation);


app.listen(3001, async () => {
    await start();
    // await sendMail({
    //   email: 'ledat16072004@gmail.com',
    //   title: 'BaDaFood Ngon&Nhanh',
    //   html: `<h1> haaaaaaaaaaaaaa </h1>`
    // });
    console.log("API UserService running on port", PORT);
})
