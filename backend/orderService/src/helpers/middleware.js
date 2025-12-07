const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const jwt = require('jsonwebtoken');
// const nodemailer = require("nodemailer");

module.exports.authenticate  = async (req, res, next) =>{
    const token = req.headers["authorization"];
    if (!token) return res.sendStatus(401).json({message: "Cần đăng nhập người dùng"});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

// module.exports.sendMail = async ({email, title, html}) =>{
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         service: "Gmail",
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PWD
//         }
//     })

//     const message = {
//         from: "Admin from BaDaFood",
//         to: email,
//         subject: title,
//         html: html
//     }
//     const result = await transporter.sendMail(message);
//     return result;
// }

// module.exports= {sendMail, authenticate, sanitizeUser}