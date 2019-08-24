import Joi from 'joi';

export const userSchema = Joi.object().keys({
    name: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().trim().regex(/^[a-zA-Z0-9]{6,10}$/).required(),
    is_admin: Joi.boolean(),
    created_at: Joi.number().integer(),
    created_by: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/).required(),
    updated_at: Joi.number().integer(),
    updated_by: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/).required()
});
