const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const jwt = require('jsonwebtoken');

module.exports.authenticate  = async (req, res, next) =>{
    const token = req.headers["authorization"];
    if (!token) return res.sendStatus(401).json({message: "Cần đăng nhập người dùng"});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.sendStatus(403).json({message: "Phiên đăng nhập hết hạn"});;
        req.user = user;
        next();
    })
}