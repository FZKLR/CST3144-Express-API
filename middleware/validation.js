const Joi = require('joi');

/**
 * Validation schemas for the After-School application
 */
const schemas = {
    // Schema for creating a new order (supports coursework order fields)
    order_create: Joi.object({
        name: Joi.string().trim().min(1).required().messages({
            'any.required': 'Name is required.',
            'string.empty': 'Name cannot be empty.'
        }),
        phone: Joi.string().trim().min(1).required().messages({
            'any.required': 'Phone number is required.',
            'string.empty': 'Phone number cannot be empty.'
        }),
        lessonIDs: Joi.array().items(Joi.string().trim().min(1)).min(1).required().messages({
            'any.required': 'lessonIDs is required.',
            'array.min': 'At least one lesson ID is required.'
        }),
        space: Joi.number().integer().min(1).required().messages({
            'number.base': 'Space must be a number.',
            'number.min': 'Space must be at least 1.',
            'any.required': 'Space is required.'
        })
    }),

    // Schema for updating any lesson attribute (e.g., space, topic, price, location, icon)
    lesson_update: Joi.object({
        topic: Joi.string().trim().min(1),
        location: Joi.string().trim().min(1),
        price: Joi.number().min(0),
        space: Joi.number().integer().min(0),
        icon: Joi.string().trim().min(1),
        title: Joi.string().trim().min(1).max(200),
        description: Joi.string().trim().max(2000),
        content: Joi.string(),
        category: Joi.string().trim().min(1)
    }).min(1).unknown(true)
};

/**
 * Validates a request body against a schema
 * @param {Object} schema - The Joi schema
 * @param {Object} data - The request body data
 * @returns {Object} - Validation result { error, value }
 */
const validate = (schema, data) => {
    const { error, value } = schema.validate(data, {
        allowUnknown: true,
        abortEarly: false
    });
    return { error, value };
};

module.exports = { schemas, validate };