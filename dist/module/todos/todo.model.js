"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
mongoose_1.default.connect('mongodb://localhost/todos', { useNewUrlParser: true });
const TodoSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    tasks: { type: mongoose_1.Schema.Types.ObjectId, ref: 'tasks' },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String },
    updated_at: { type: Date, default: Date.now },
    updated_by: { type: String },
});
var todos = mongoose_1.default.model('todos', TodoSchema);
exports.todos = todos;
//# sourceMappingURL=todo.model.js.map