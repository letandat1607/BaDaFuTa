const Joi = require("joi");

const registerSchema = Joi.object({
    user_name: Joi.string().min(3).max(30).required(),
    full_name: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().pattern(/^[0-9]{9,20}$/).optional(),
    password: Joi.string().min(6).required(),
    image: Joi.string().uri().optional(),
    role: Joi.string().required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };
