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

module.exports = {
    connectRabbitMQ,
};
