const Joi = require("joi");

const orderSchema = Joi.object({
  // id: Joi.string().uuid().optional(),
  merchant_id: Joi.string().uuid().optional(),
  user_id: Joi.string().uuid().required(),
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

const orderUpdateSchema = Joi.object({
  merchant_id: Joi.string().uuid().optional(),
  user_id: Joi.string().uuid().optional(),
  full_name: Joi.string().max(100).optional(),
  note: Joi.string().allow(null, "").optional(),
  phone: Joi.string().max(20).optional(),
  method: Joi.string().optional(),
  delivery_address: Joi.string().optional(),
  delivery_fee: Joi.number().integer().min(0).optional(),
  total_amount: Joi.number().integer().min(0).optional(),
  status: Joi.string().optional(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional()
})
module.exports = {orderSchema, orderUpdateSchema};
