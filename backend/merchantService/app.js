const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const app = express();const { sequelize, connectDB } = require("./src/utils/db");
const PORT = process.env.merchantServicePORT;
const {authenticate} = require("./src/helpers/middleware");
const {
    getAllMerchant,
    getMenuMerchant, 
    getMenuClient, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem,
    createCategory, 
    updateCategory, 
    deleteCategory,
    getMerchant,
    getOption, 
    updateOptionItem,
    createOptionItem,
    updateOption
} = require("./src/controllers/merchantController")

const start = async () => {
    await connectDB();
    await sequelize.sync();
    console.log("✅ All models were synchronized successfully.");
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

app.get("/getMenuMerchant/:id", getMenuMerchant);
app.get("/getMenuClient/:id", getMenuClient);
app.get("/getMerchant/:id", getMerchant);
app.get("/getOption/:id", getOption);

app.post("/createMenuItem",createMenuItem);
app.post("/updateMenuItem/:id", updateMenuItem);
app.post("/deleteMenuItem",authenticate, deleteMenuItem);
app.post("/updateOptionItem/:id", updateOptionItem);
app.post("/createOptionItem/", createOptionItem);
app.post("/updateOption/:id", updateOption)


app.listen(PORT, async () =>{
    await start();
    console.log("API MerchantService run on port:", PORT)
})