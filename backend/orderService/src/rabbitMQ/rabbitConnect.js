const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });
const amqp = require('amqp-connection-manager');

let connection;
function connectRabbitMQ() {
    if (!connection) {
        const RABBITMQ_URL = process.env.RABBITMQ_URL;
        connection = amqp.connect([RABBITMQ_URL],{
            reconnectTimeInSeconds: 5,
        });
        connection.on("connect", () => console.log("Connected to RabbitMQ"));
        connection.on("disconnect", (err) =>
            console.error("Disconnected from RabbitMQ:", err.message)
        );
    }
    return connection;
}

async function closeRabbitMQ() {
    if (!connection) {
        console.log("No RabbitMQ connection to close.");
        return;
    }

    try {
        console.log("Closing RabbitMQ connection...");
        await connection.close();    // ← amqp-connection-manager hỗ trợ close() trực tiếp
        console.log("RabbitMQ connection closed successfully");
    } catch (err) {
        console.warn("Error while closing RabbitMQ connection:", err.message);
    } finally {
        connection = null;  // reset lại để lần chạy test sau tạo mới
    }
}

module.exports = {
    connectRabbitMQ,
    closeRabbitMQ
};
