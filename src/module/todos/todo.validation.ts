import Joi from 'joi';

export const TodoSchema = Joi.object().keys({
    name: Joi.string().trim().regex(/^[a-zA-Z0-9]{3,10}$/).required(),
    description: Joi.string().required(),
    is_active: Joi.boolean(),
    is_deleted: Joi.boolean(),
    status: Joi.boolean(),
    tasks: Joi.string().alphanum(),
    created_at: Joi.number().integer(),
    created_by: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    updated_at: Joi.number().integer(),
    updated_by: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    _id: Joi.any().required(),
    loginuser: Joi.any()
});

export const updateSchema = Joi.object().keys({
    name: Joi.string().trim().regex(/^[a-zA-Z0-9]{3,10}$/),
    description: Joi.string(),
    is_active: Joi.boolean(),
    is_deleted: Joi.boolean(),
    status: Joi.boolean(),
    _id: Joi.any().required(),
    loginuser: Joi.any()
});