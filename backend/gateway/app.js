require("dotenv").config({ path: "../../.env" });

const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const { authenticate } = require("./src/helpers/middleware");
const cors = require('cors');
const app = express();

const PORT = process.env.gatewayPORT;

app.use(morgan("dev"));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// app.use(
//     "/api/auth/public/logic",
//     createProxyMiddleware({ 
//         target: `http://localhost:${process.env.userServicePORT}`, 
//         changeOrigin: true, 
//     })
// );
// app.use(
//     "/api/auth/protected",
//     authenticate,
//     createProxyMiddleware({
//       target: `http://localhost:${process.env.userServicePORT}`,
//       changeOrigin: true,
//       pathRewrite: { "^/api/auth/protected": "/api/auth" }
//     })
// );

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
  

app.listen(PORT, () => {
    console.log("API Gateway running on port", PORT);
  });

  //system context