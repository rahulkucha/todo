"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    user_id: { type: String },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String },
    updated_at: { type: Date, default: Date.now },
    updated_by: { type: String },
}, { toJSON: { virtuals: true } });
taskSchema.virtual("todolist", {
    ref: "todos",
    localField: "_id",
    foreignField: "tasks"
});
var tasks = mongoose_1.default.model("tasks", taskSchema);
exports.tasks = tasks;
//# sourceMappingURL=task.model.js.map