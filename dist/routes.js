"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const todo_controller_1 = __importDefault(require("./module/todo/todo.controller"));
const user_controller_1 = __importDefault(require("./module/users/user.controller"));
function registerRoutes(app) {
    new todo_controller_1.default().register(app);
    new user_controller_1.default().register(app);
}
exports.registerRoutes = registerRoutes;
//# sourceMappingURL=routes.js.map