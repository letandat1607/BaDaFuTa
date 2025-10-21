const Joi = require("joi");

const cartItemSchema = Joi.object({
  id: Joi.string().uuid(),
  cart_id: Joi.string().uuid().required(),
  menu_item_id: Joi.string().uuid().required(),
  note: Joi.string().optional().allow(""),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().integer().min(0).required(),
});

module.exports = cartItemSchema;
