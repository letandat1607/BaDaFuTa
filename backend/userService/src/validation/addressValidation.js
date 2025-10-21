const Joi = require("joi");

const addressSchema = Joi.object({
  label: Joi.string().max(50).optional(),
  geometry: Joi.object().optional(),
  full_address: Joi.string().max(255).required()
});

module.exports = { addressSchema };
