const Joi = require("joi");

const optionSchema = Joi.object({
  //   id: Joi.string().uuid(),
  merchant_id: Joi.string().uuid().required(),
  option_name: Joi.string().max(100).required(),
  multi_select: Joi.boolean().default(false),
  require_select: Joi.boolean().default(false),
  number_select: Joi.number().integer().min(0)
});

// Schema dành riêng cho cập nhật (update)
const updateOptionSchema = optionSchema.fork(
  Object.keys(optionSchema.describe().keys),
  (schema) => schema.optional()
);

module.exports = { optionSchema, updateOptionSchema };