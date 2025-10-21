const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const app = express();
const PORT = process.env.paymentServicePORT;
// const { sequelize, connectDB } = require("./src/utils/db");
// const {authenticate} = require("./src/helpers/middleware");
const {handlePayment, checkPayment} = require("./src/controllers/paymentController")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/pay", handlePayment);
app.get("/api/checkVnpay", async (req, res) =>{
    console.log(req.query);
})
app.get("/api/checkPayment", checkPayment);


app.listen(3004, async () => {
    // await start();
    console.log("API PaymentService run on port:", PORT)
})