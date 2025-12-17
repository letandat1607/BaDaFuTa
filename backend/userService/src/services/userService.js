const userRepo = require("../repositories/userRepository");
const {registerSchema, loginSchema} = require("../validation/userValidation"); 
const {addressSchema} = require("../validation/addressValidation"); 
const bcrypt = require("bcrypt");
const {v4} = require("uuid");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const GATEWAY_URL = process.env.GATEWAY_URL;
const jwt = require("jsonwebtoken");
// const {sendMail} = require("../helpers/sendMail")
const {sanitizeUser, sendMail} = require("../helpers/middleware");
const {Op} = require('sequelize')

module.exports.register = async (data) => {
    const {error, value} = registerSchema.validate(data);
    if(error) throw new Error(error.message);

    const exitsUser = await userRepo.findOneUser({
        [Op.or]: [
            {email: value.email},
            {phone_number: value.phone_number}
        ]
    })
    if(exitsUser) throw new Error("Email hoặc số điện thoại đã tồn tại");

    const salt = await bcrypt.genSalt(10);
    value.password = await bcrypt.hash(value.password, salt);
    value.id = v4();

    return await userRepo.createUser(value);
} 

module.exports.signIn = async (data) => {
    const {error, value} = loginSchema.validate(data);
    if(error) throw new Error(error.message);

    const user = await userRepo.findOneUser({
        [Op.and]: [
            {email: value.email},
            {role: value.role}
        ]
    })
    if(!user) throw new Error("Email hoặc mật khẩu không đúng");
    const checkPwd = await bcrypt.compare(value.password, user.password);
    if(!checkPwd) throw new Error("Email hoặc mật khẩu không đúng");

    const payload = {id: user.id, user_name: user.user_name, email: user.email, role: user.role};
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

    return {token, user: sanitizeUser(user)};
}