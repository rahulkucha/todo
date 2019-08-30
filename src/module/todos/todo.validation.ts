import Joi from 'joi';

export const TodoSchema = Joi.object().keys({
 //   task_id: Joi.required().integer(),
    todo: Joi.string().regex(/^[a-zA-Z]{1,10}$/).trim().required(),
    todo_id: Joi.number().integer().required(),

    //  flag: Joi.required().boolean()
});
