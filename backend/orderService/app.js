const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const app = express();
const { sequelize, connectDB } = require("./src/utils/db");
const PORT = process.env.orderServicePORT;
// const {authenticate} = require("./src/helpers/middleware");
const {checkOutOrder, getAllOrder, updateOrderStatus } = require("./src/controllers/orderController")

const start = async () => {
    await connectDB();
    await sequelize.sync();
    console.log("✅ All models were synchronized successfully.");
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/profile", (req, res) => {
    res.json({
      id: 1,
      name: "Nguyen Van A",
      role: "User Service"
    });
});

app.post("/checkOutOrder", checkOutOrder);
app.post("/updateOrderStatus", updateOrderStatus);


app.listen(3003, async () =>{
    await start();
    console.log("API OrderService run on port:", PORT)
})