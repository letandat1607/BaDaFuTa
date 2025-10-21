const Joi = require("joi");

const optionSchema = Joi.object({
//   id: Joi.string().uuid(),
  option_name: Joi.string().max(100).required(),
  multi_select: Joi.boolean().default(false),
  require_select: Joi.boolean().default(false),
  number_select: Joi.number().integer().min(0)
});

module.exports = {optionSchema};
