import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    user_id: { type: String },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String},
    updated_at: { type: Date, default: Date.now },
    updated_by: { type: String}
  });

var tasks = mongoose.model('tasks', taskSchema);

export { tasks };