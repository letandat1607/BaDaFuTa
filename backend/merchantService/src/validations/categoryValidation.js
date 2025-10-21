const Joi = require("joi");

const categorySchema = Joi.object({
    // id: Joi.string().uuid({ version: "uuidv4" }).optional(),
    category_name: Joi.string().min(2).max(100).required(),
});

module.exports = { categorySchema };
