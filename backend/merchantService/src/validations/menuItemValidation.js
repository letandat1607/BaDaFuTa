const Joi = require("joi");

const menuItemSchema = Joi.object({
    // id: Joi.string().uuid().optional(),
    // merchant_id: Joi.string().uuid().required(),
    category_id: Joi.string().uuid().allow(null),
    name_item: Joi.string().max(100).required(),
    price: Joi.number().integer().min(0).required(),
    likes: Joi.number().integer().min(0).default(0),
    sold_count: Joi.number().integer().min(0).default(0),
    description: Joi.string().allow("", null),
    image_item: Joi.object({
        url: Joi.string().required(),
    }).optional().allow(null),
    status: Joi.boolean().default(false),
});

module.exports = { menuItemSchema };
