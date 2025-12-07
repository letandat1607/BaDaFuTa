const Joi = require("joi");

const orderItemSchema = Joi.object({
  // id: Joi.string().uuid(),
  order_id: Joi.string().uuid().required(),
  menu_item_id: Joi.string().uuid().required(),
  note: Joi.string().allow(null, "").optional(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().integer().min(1).required(),
});

module.exports = orderItemSchema;
