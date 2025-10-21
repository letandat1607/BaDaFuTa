const Joi = require("joi");

const paymentSchema = Joi.object({
  id: Joi.string().uuid(),
  user_id: Joi.string().uuid().required(),
  merchant_id: Joi.string().uuid().required(),
  order_id: Joi.string().uuid().required(),
  amount: Joi.number().integer().min(0).required(),
  currency: Joi.string().max(10).required(), // ví dụ: "USD", "VND"
  transaction_code: Joi.string().max(100).required(),
  payment_method: Joi.string().max(50).required(),
  status: Joi.string().valid("pending", "completed", "failed", "refunded").required(), // có thể tùy chỉnh thêm
});

module.exports = paymentSchema;
