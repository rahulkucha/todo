import Joi from "joi";

export const registerSchema = Joi.object().keys({
    name: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().trim().regex(/^[a-zA-Z0-9]{6,10}$/).required(),
    is_admin: Joi.boolean(),
    loginuser: Joi.any()
});

export const userSchema = Joi.object().keys({
    name: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    email: Joi.string().email().required(),
    password: Joi.string().trim().regex(/^[a-zA-Z0-9]{6,10}$/).required(),
    is_admin: Joi.boolean(),
    is_active: Joi.boolean(),
    profile_image: Joi.string(),
    created_at: Joi.number().integer(),
    created_by: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    updated_at: Joi.number().integer(),
    updated_by: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    loginuser: Joi.any(),
    _id: Joi.any()
});

export const updateSchema = Joi.object().keys({
    name: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    email: Joi.string().email(),
    password: Joi.string().trim().regex(/^[a-zA-Z0-9]{6,10}$/),
    is_admin: Joi.boolean(),
    is_active: Joi.boolean(),
    profile_image: Joi.string(),
    created_at: Joi.number().integer(),
    created_by: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    updated_at: Joi.number().integer(),
    updated_by: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    loginuser: Joi.any(),
    _id: Joi.any()
});