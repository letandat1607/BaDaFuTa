const Joi = require("joi");

const menuItemOptionSchema = Joi.object({
  // menu_item_id: Joi.string().uuid().required(),
  // option_id: Joi.string().uuid().required()
});

module.exports = { menuItemOptionSchema };
