const Joi = require("joi");

const optionItemSchema = Joi.object({
  // id: Joi.string().uuid(),
  option_id: Joi.string().required(),
  option_item_name: Joi.string().max(100).required(),
  price: Joi.number().integer().min(0).required(),
  status: Joi.boolean().default(false),
  status_select: Joi.boolean().default(false)
  
});

module.exports = {optionItemSchema};
