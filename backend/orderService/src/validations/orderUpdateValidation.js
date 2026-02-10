const Joi = require('joi');

const orderUpdateSchema = Joi.object({
    merchant_id: Joi.string().uuid().optional(),
    user_id: Joi.string().uuid().optional(),
    full_name: Joi.string().max(100).optional(),
    note: Joi.string().allow(null, "").optional(),
    phone: Joi.string().max(20).optional(),
    method: Joi.string().optional(),
    delivery_address: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
        full_address: Joi.string().required()
    }).optional(),
    delivery_fee: Joi.number().integer().min(0).optional(),
    total_amount: Joi.number().integer().min(0).optional(),
    status: Joi.string().optional(),
    created_at: Joi.date().optional(),
    updated_at: Joi.date().optional()
});

module.exports = orderUpdateSchema;