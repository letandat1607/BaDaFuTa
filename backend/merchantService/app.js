const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const app = express(); 
const { sequelize, connectDB } = require("./src/utils/db");
const PORT = process.env.merchantServicePORT;
const { authenticate } = require("./src/helpers/middleware");
const {
    getAllMerchant,
    getMenuClient,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    createCategory,
    updateCategory,
    deleteCategory,
    getMerchant,
    getMenuNoneCategory,

    updateOptionItem,
    createOptionItem,
    deleteOptionItem,

    getOption,
    updateOption,
    createOption,
    deleteOption,   
    getMenuItemWithOption,

    deleteMenuItemOption,
    createMenuItemOption,
    updateMenuItemOption,
    getMenuItemOption,
    getMenuNoneItemOption
} = require("./src/controllers/merchantController")
const {startConsumers} = require('./src/rabbitMQ/rabbitConsumer');

const start = async () => {
    await connectDB();
    await sequelize.sync();
    console.log("✅ All models were synchronized successfully.");

    await startConsumers();
    console.log("Consumer start successed");
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// getAllMerchant,
// getMenuMerchant, 
// getMenuClient, 
// createMenuItem, 
// updateMenuItem, 
// deleteMenuItem,
// createCategory, 
// updateCategory, 
// deleteCategory,

// app.get("/getMenuMerchant/:id", getMenuMerchant);
app.get("/getMenuClient/:id", getMenuClient);
app.get("/getMenuItemNoneCategory/:id", getMenuNoneCategory);
app.get("/getMerchant/:id", getMerchant);
app.get("/getOption/:id", getOption);
app.get("/getAllMerchant", getAllMerchant);
app.post("/getMenuWithOption/:id", getMenuItemWithOption)
app.get("/getMenuItemOption/:id", getMenuItemOption);
app.get("/getMenuNoneItemOption/:id", getMenuNoneItemOption);

app.post("/createCategory/", authenticate, createCategory);
app.post("/deleteCategory/:id", authenticate, deleteCategory);
app.post("/updateCategory/:id", authenticate, updateCategory);

app.post("/createMenuItem", authenticate, createMenuItem);
app.post("/updateMenuItem/:id", authenticate, updateMenuItem);
app.post("/deleteMenuItem/:id", authenticate, deleteMenuItem);

app.post("/deleteOption/:id", authenticate, deleteOption);
app.post("/updateOption/:id", authenticate, updateOption);
app.post("/createOption/", authenticate, createOption);

app.post("/updateOptionItem/:id", authenticate, updateOptionItem);
app.post("/createOptionItem/", authenticate, createOptionItem);
app.post("/deleteOptionItem/:id", deleteOptionItem);

app.post("/updateMenuItemOption/", authenticate, updateMenuItemOption);
app.post("/createMenuItemOption/", authenticate, createMenuItemOption);
app.delete("/deleteMenuItemOption/", authenticate, deleteMenuItemOption);


app.listen(PORT, async () => {
    await start();
    console.log("API MerchantService run on port:", PORT)
})

require('./src/grpc/server');