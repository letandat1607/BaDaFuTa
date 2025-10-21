const Joi = require("joi");

const cartSchema = Joi.object({
  id: Joi.string().uuid(),
  merchant_id: Joi.string().uuid().required(),
  user_id: Joi.string().uuid().required(),
  total: Joi.number().integer().min(0).required(),
});

module.exports = cartSchema;
