const { User, Role, UserRole, Address } = require("../models/index");
const {registerSchema} = require("../validation/userValidation"); 
const {addressSchema} = require("../validation/addressValidation"); 
const bcrypt = require("bcrypt");
const {v4} = require("uuid");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const GATEWAY_URL = process.env.GATEWAY_URL;
const jwt = require("jsonwebtoken");
// const {sendMail} = require("../helpers/sendMail")
const {sanitizeUser, sendMail} = require("../helpers/middleware");

module.exports.createUser = async (req, res) => {
  try {
    console.log("Req.body: ",req.body);
    const userId = v4();
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value.password, salt);

    // const role = await Role.findOne({where: { role_name: "customer"}})
    // if(!role) return res.status(401).json({ error: error.details[0].message });
    // const userRoles = await UserRole.create({
    //   user_id: userId,
    //   role_id: role.id
    // }); 

    const user = await User.create({
        id: userId,
        ...value,
        password: hashedPassword,
    });


    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.log("userController error", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.signInUser = async (req, res) => {
  try{
    const {email, password, role} = req.body;

    const user = await User.findOne({
      where: {email: email, role: role}
    });
    
    if(!user) return res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });

    const checkPwd = await bcrypt.compare(password, user.password);
    if(!checkPwd) return res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
    
    const payload = {id: user.id, user_name: user.user_name, email: user.email}
    
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
    return res.json({
      message: "Đăng nhập thành công",
      token,
      user: sanitizeUser(user)
    })
  }catch(err){
    console.log("userController login error", err);
    res.status(500).json({ err });
  }
}

module.exports.updateProfile = async (req, res) =>{
  try{
    const {newUserInfor} = req.body;
    const user = await User.findOne({where: {id: req.user.id}});

    if(!user) return res.status(404).json({error: "Không tìm thấy người dùng"});

    user.set(newUserInfor);
    const statusUpdate = await user.save();
    if(!statusUpdate) return res.status(400).json({error: "Xảy ra vấn đề khi update"});
    return res.json({
      message: "Cập nhật thành công",
      user: sanitizeUser(user)
    });
  }catch(err){
    console.log("userController update error", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports.createLocation = async (req, res) =>{
  try{
    const user = await User.findOne({where: {id: req.user.id}});
    if(!user) return res.status(404).json({error: "Không tìm thấy người dùng"});

    const { error, value } = addressSchema.validate(req.body.location);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const address = await Address.create({
      id: v4(),
      user_id: req.user.id,
      ...value,
    })
    return res.status(201).json({ message: "Thêm địa chỉ thành công", address });
  }catch(err){
    console.log("userController create location error", err);
    res.status(500).json({ error: err.message });
  }
}