import mongoose from "mongoose";
import { join } from "path";
import { any, boolean } from "joi";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    is_admin: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String, default: name },
    updated_at: { type: Date, default: Date.now },
    updated_by: { type: String, default: name }
});

var users = mongoose.model('users', userSchema);

export { users };