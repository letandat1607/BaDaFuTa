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

app.get("/profile", (req, res) => {
    res.json({
        id: 1,
        name: "Nguyen Van A",
        role: "User Service"
    });
    // console.log("AAAAAAAAAAAAAAAAAAAAAa")
});

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

app.post("/createCategory/", createCategory);
app.post("/deleteCategory/:id", deleteCategory);
app.post("/updateCategory/:id", updateCategory);

app.post("/createMenuItem", createMenuItem);
app.post("/updateMenuItem/:id", updateMenuItem);
app.post("/deleteMenuItem/:id", deleteMenuItem);

app.post("/deleteOption/:id", deleteOption);
app.post("/updateOption/:id", updateOption);
app.post("/createOption/", createOption);

app.post("/updateOptionItem/:id", updateOptionItem);
app.post("/createOptionItem/", createOptionItem);
app.post("/deleteOptionItem/:id", deleteOptionItem);

app.post("/updateMenuItemOption/", updateMenuItemOption);
app.post("/createMenuItemOption/", createMenuItemOption);
app.delete("/deleteMenuItemOption/", deleteMenuItemOption);


app.listen(PORT, async () => {
    await start();
    console.log("API MerchantService run on port:", PORT)
})