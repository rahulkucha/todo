"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    is_admin: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    profile_image: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String },
    updated_at: { type: Date, default: Date.now },
    updated_by: { type: String }
});
var users = mongoose_1.default.model('users', userSchema);
exports.users = users;
//# sourceMappingURL=user.model.js.map