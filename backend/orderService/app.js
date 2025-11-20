const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const app = express();
const { sequelize, connectDB } = require("./src/utils/db");
const PORT = process.env.orderServicePORT;
const {startConsumers} = require("./src/rabbitMQ/rabbitConsumer");
// const {authenticate} = require("./src/helpers/middleware");
const {authenticate} = require("./src/helpers/middleware")
const {
    checkOutOrder,
    // getAllOrder,
    updateOrderStatusPayment,
    getAllOrderMerchant,
    updateOrder,
    getOrder,
    getUserOrders
} = require("./src/controllers/orderController");

const start = async () => {
    await connectDB();
    await sequelize.sync();
    console.log("All models were synchronized successfully.");

    await startConsumers();
    console.log("Consumer start successed");
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


app.get("/getUserOrders", authenticate, getUserOrders)
app.post("/checkOutOrder", authenticate, checkOutOrder);
// app.post("/getAllOrder", getAllOrder);
// app.get("/updateOrderStatusPayment/:id", updateOrderStatusPayment);

app.get("/getOrder/:id", authenticate, getOrder);

app.get("/getAllOrderMerchant/:id", getAllOrderMerchant);

app.post("/updateOrder/:id", updateOrder);


app.listen(PORT, async () => {
    await start();
    console.log("API OrderService run on port:", PORT)
})