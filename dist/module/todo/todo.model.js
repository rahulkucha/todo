"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect('mongodb://localhost/todo', { useNewUrlParser: true });
const TaskSchema = new mongoose_1.default.Schema({
    name: String,
    description: String,
    is_active: Boolean,
    is_deleted: Boolean,
    user_id: Number,
    created_at: { type: Date, default: Date.now },
    created_by: { type: String },
    updated_at: { type: Date, default: Date.now },
    updated_by: { type: String }
});
const TodoSchema = new mongoose_1.default.Schema({
    name: String,
    description: String,
    is_active: Boolean,
    is_deleted: Boolean,
    status: { type: String, default: "pending" },
    task_id: Number,
    created_at: { type: Date, default: Date.now },
    created_by: { type: String },
    updated_at: { type: Date, default: Date.now },
    updated_by: { type: String }
});
var todos = mongoose_1.default.model('todos', TodoSchema);
exports.todos = todos;
var tasks = mongoose_1.default.model('tasks', TaskSchema);
exports.tasks = tasks;
//# sourceMappingURL=todo.model.js.map