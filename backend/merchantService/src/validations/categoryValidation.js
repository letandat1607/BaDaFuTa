const Joi = require("joi");

const categorySchema = Joi.object({
    // id: Joi.string().uuid({ version: "uuidv4" }).optional(),
    merchant_id: Joi.string().uuid().required(),
    category_name: Joi.string().min(1).max(100).required(),
});

// Schema dành cho cập nhật (update)
// -> tất cả các field đều optional
const updateCategorySchema = categorySchema.fork(
  Object.keys(categorySchema.describe().keys),
  (schema) => schema.optional()
);

module.exports = { categorySchema, updateCategorySchema };