import Joi from 'joi';

export const taskSchema = Joi.object().keys({
    name: Joi.string().trim().regex(/^[a-zA-Z0-9]{3,10}$/).required(),
    description: Joi.string().required(),
    is_active: Joi.boolean(),
    is_deleted: Joi.boolean(),
    user_id: Joi.string().alphanum(),
    created_at: Joi.number().integer(),
    created_by: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    updated_at: Joi.number().integer(),
    updated_by: Joi.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    loginuser: Joi.any()
});