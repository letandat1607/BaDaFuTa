const Joi = require("joi");

const orderSchema = Joi.object({
  // id: Joi.string().uuid().optional(),
  merchant_id: Joi.string().required(),
  user_id: Joi.string().required(),
  full_name: Joi.string().max(100).required(),
  note: Joi.string().allow(null, "").optional(),
  phone: Joi.string().max(20).required(),
  method: Joi.string().required(),
  delivery_address: Joi.string().required(),
  delivery_fee: Joi.number().integer().min(0).required(),
  total_amount: Joi.number().integer().min(0).required(),
  status: Joi.string().required(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional()
});

module.exports = orderSchema;
