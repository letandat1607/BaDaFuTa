const Joi = require("joi");

const cartItemOptionSchema = Joi.object({
  cart_item_id: Joi.string().uuid().required(),
  option_item_id: Joi.string().uuid().required()
});

module.exports = cartItemOptionSchema;
