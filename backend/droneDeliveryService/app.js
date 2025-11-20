const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const app = express();
const PORT = process.env.droneDeliveryServicePORT || 3005;
const { sequelize, connectDB } = require("./src/utils/db");
const {startConsumers} = require("./src/rabbitMQ/rabbitConsumer")
const droneDeliveryController = require("./src/controllers/droneDeliveryController");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const start = async () => {
    await connectDB();
    await sequelize.sync();
    console.log("All models were synchronized successfully.");

    await startConsumers();
    console.log("Consumer start successed");
};

app.get("/merchant/:id", droneDeliveryController.getDronesForMerchant);


app.listen(PORT, async () => {
    await start();
    console.log("API DroneDeliveryService run on port:", PORT)
})