const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const app = express();
const PORT = process.env.paymentServicePORT;
const {startConsumers} = require("./src/rabbitMQ/rabbitConsumer")
// const { sequelize, connectDB } = require("./src/utils/db");
// const {authenticate} = require("./src/helpers/middleware");
const {checkPaymentMomo} = require("./src/controllers/paymentController")


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const start = async () => {
    await startConsumers();
    console.log("Consumer start successed");
}

// app.post("/pay", handlePayment);
app.get("/checkPaymentVnp", async (req, res) =>{
    console.log(req.query);
})
app.get("/checkPaymentMomo", checkPaymentMomo);


app.listen(PORT, async () => {
    await start();
    console.log("API PaymentService run on port:", PORT)
})