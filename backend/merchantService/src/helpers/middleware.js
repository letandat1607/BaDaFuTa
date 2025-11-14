const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const jwt = require('jsonwebtoken');

module.exports.authenticate  = async (req, res, next) =>{
    console.log("Bắt đầu auth");
    const token = req.headers["authorization"];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
    console.log("kết thúc auth");
}