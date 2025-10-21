const Joi = require("joi");

const merchantSchema = Joi.object({
//   id: Joi.string().uuid(),
  // user_id: Joi.string().uuid().required(),
  merchant_name: Joi.string().max(100).required(),
  location: Joi.string().max(100).required(),
  phone: Joi.string().max(20).optional(),
  email: Joi.string().email().required(),
  profile_image: Joi.string().required(),
  cover_image: Joi.string().optional(),
  time_open: Joi.object().pattern(Joi.string(), Joi.string()).optional()
});

module.exports = merchantSchema;
