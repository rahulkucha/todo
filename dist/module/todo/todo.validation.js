"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.TodoSchema = joi_1.default.object().keys({
    //   task_id: Joi.required().integer(),
    todo: joi_1.default.string().regex(/^[a-zA-Z]{1,10}$/).trim().required(),
    todo_id: joi_1.default.number().integer().required(),
});
//# sourceMappingURL=todo.validation.js.map