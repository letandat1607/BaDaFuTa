require("dotenv").config({ path: "../../.env" });

const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const { authenticate } = require("./src/helpers/middleware");
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const amqp = require("amqplib");
const GatewayService = require('./src/services/gatewayService');
const { connectRabbitMQ } = require("./src/rabbitMQ/rabbitConnect");
const { startConsumers } = require("./src/rabbitMQ/rabbitConsumer");

const PORT = process.env.gatewayPORT;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', credentials: true },
  methods: ["GET", "POST"],
  transports: ["websocket", "polling"],
});

const gatewayService = new GatewayService(io);

const start = async () => {
  gatewayService.setupSocket();
  const conn = await connectRabbitMQ();
  await startConsumers(gatewayService);
}

app.use(morgan("dev"));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// API AUTH → USER SERVICE
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
  })
);

// API MERCHANT → MERCHANT SERVICE
app.use(
  "/api/merchant",
  createProxyMiddleware({
    target: process.env.MERCHANT_SERVICE_URL,
    changeOrigin: true,
  })
);

// API ORDERS → ORDER SERVICE
app.use(
  "/api/order",
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true,
  })
);

// API PAYMENTS → PAYMENT SERVICE
app.use(
  "/api/payment",
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL,
    changeOrigin: true,
  })
);

server.listen(PORT, async () => {
  await start();
  console.log("API Gateway running on port", PORT);
});

//system context