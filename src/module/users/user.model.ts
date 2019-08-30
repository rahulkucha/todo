import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    is_admin: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    profile_image: { type: String, default: null },
    created_at: { type: Date, default: Date.now},
    created_by: { type: String },
    updated_at: { type: Date, default: Date.now},
    updated_by: { type: String }
});

var users = mongoose.model('users', userSchema);

export { users };