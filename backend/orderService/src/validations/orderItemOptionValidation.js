const Joi = require("joi");

const orderItemOptionSchema = Joi.object({
  order_item_id: Joi.string().uuid().required(),
  option_item_id: Joi.string().uuid().required(),
});

module.exports = orderItemOptionSchema;
