"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect('mongodb://localhost/todo', { useNewUrlParser: true });
const TodoSchema = new mongoose_1.default.Schema({
    name: String,
    description: String,
    is_deleted: Boolean,
    user_id: Number,
    created_at: { type: Date, default: Date.now },
    created_by: { type: String, default: name },
    updated_at: { type: Date, default: Date.now },
    updated_by: { type: String, default: name }
});
const TaskSchema = new mongoose_1.default.Schema({
    // todo_id: Number,
    //  task_id: Number,
    task: String,
    flag: Boolean
});
var todos = mongoose_1.default.model('todos', TodoSchema);
exports.todos = todos;
var tasks = mongoose_1.default.model('tasks', TaskSchema);
exports.tasks = tasks;
//# sourceMappingURL=todo.model.js.map