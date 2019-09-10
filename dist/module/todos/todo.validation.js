"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.TodoSchema = joi_1.default.object().keys({
    name: joi_1.default.string().trim().regex(/^[a-zA-Z0-9]{3,10}$/).required(),
    description: joi_1.default.string().required(),
    is_active: joi_1.default.boolean(),
    is_deleted: joi_1.default.boolean(),
    status: joi_1.default.boolean(),
    tasks: joi_1.default.string().alphanum(),
    created_at: joi_1.default.number().integer(),
    created_by: joi_1.default.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    updated_at: joi_1.default.number().integer(),
    updated_by: joi_1.default.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    _id: joi_1.default.any().required(),
    loginuser: joi_1.default.any()
});
exports.updateSchema = joi_1.default.object().keys({
    name: joi_1.default.string().trim().regex(/^[a-zA-Z0-9]{3,10}$/),
    description: joi_1.default.string(),
    is_active: joi_1.default.boolean(),
    is_deleted: joi_1.default.boolean(),
    status: joi_1.default.boolean(),
    _id: joi_1.default.any().required(),
    loginuser: joi_1.default.any()
});
//# sourceMappingURL=todo.validation.js.map