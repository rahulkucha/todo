"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object().keys({
    name: joi_1.default.string().trim().regex(/^[a-zA-Z]{3,10}$/).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().trim().regex(/^[a-zA-Z0-9]{6,10}$/).required(),
    is_admin: joi_1.default.boolean(),
    loginuser: joi_1.default.any()
});
exports.userSchema = joi_1.default.object().keys({
    name: joi_1.default.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().trim().regex(/^[a-zA-Z0-9]{6,10}$/).required(),
    is_admin: joi_1.default.boolean(),
    is_active: joi_1.default.boolean(),
    profile_image: joi_1.default.string(),
    created_at: joi_1.default.number().integer(),
    created_by: joi_1.default.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    updated_at: joi_1.default.number().integer(),
    updated_by: joi_1.default.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    loginuser: joi_1.default.any(),
    _id: joi_1.default.any()
});
exports.updateSchema = joi_1.default.object().keys({
    name: joi_1.default.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    email: joi_1.default.string().email(),
    password: joi_1.default.string().trim().regex(/^[a-zA-Z0-9]{6,10}$/),
    is_admin: joi_1.default.boolean(),
    is_active: joi_1.default.boolean(),
    profile_image: joi_1.default.string(),
    created_at: joi_1.default.number().integer(),
    created_by: joi_1.default.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    updated_at: joi_1.default.number().integer(),
    updated_by: joi_1.default.string().trim().regex(/^[a-zA-Z]{3,10}$/),
    loginuser: joi_1.default.any(),
    _id: joi_1.default.any()
});
//# sourceMappingURL=user.validation.js.map