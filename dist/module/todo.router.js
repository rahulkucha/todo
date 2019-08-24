"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// var index = require('./todo.controller');
const todo_controller_1 = __importDefault(require("./todo.controller"));
let objTodoController = new todo_controller_1.default();
// home page
exports.default = router.get('/', objTodoController.index);
// module.exports = router;
//# sourceMappingURL=todo.router.js.map