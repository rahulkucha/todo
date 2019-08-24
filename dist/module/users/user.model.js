"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: String,
    email: String,
    password: String,
    is_admin: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String, default: name },
    updated_at: { type: Date, default: Date.now },
    updated_by: { type: String, default: name }
});
var users = mongoose_1.default.model('users', userSchema);
exports.users = users;
//# sourceMappingURL=user.model.js.map