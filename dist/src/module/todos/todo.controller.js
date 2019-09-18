"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../base.controller");
const todo_model_1 = require("./todo.model");
const todo_validation_1 = require("./todo.validation");
const joi_1 = __importDefault(require("joi"));
const helper_1 = require("../../helper/helper");
const task_model_1 = require("../tasks/task.model");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/todo", { useNewUrlParser: true });
class todoController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.init();
    }
    register(express) {
        express.use("/todo", this.router);
    }
    init() {
        this.router.post("/", helper_1.obj.verify_Token, this.todoInsert);
        this.router.get("/view", helper_1.obj.verify_Token, this.todoView);
        this.router.get("/completed", helper_1.obj.verify_Token, this.completedTodoView);
        this.router.get("/pending", helper_1.obj.verify_Token, this.pendingTodoView);
        this.router.get("/deleted", helper_1.obj.verify_Token, this.deletedTodoView);
        this.router.delete("/", helper_1.obj.verify_Token, this.todoDelete);
        this.router.put("/", helper_1.obj.verify_Token, this.todoUpdate);
    }
    todoInsert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("todoInsert");
            joi_1.default.validate(req.body, todo_validation_1.TodoSchema).then(() => __awaiter(this, void 0, void 0, function* () {
                var add = yield todo_model_1.todos.insertMany({ name: req.body.name, description: req.body.description, tasks: req.body._id, is_deleted: req.body.is_deleted });
                if (add) {
                    res.send("New todo added successfully");
                }
            })).catch((e) => {
                console.log(e);
                res.send(e.details[0].message);
            });
        });
    }
    todoView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("todoView");
            var admin = req.body.loginuser.is_admin;
            var id = req.body.loginuser._id;
            if (admin) {
                console.log("admin");
                var queries1 = { is_deleted: false };
                var todoarr = [];
                task_model_1.tasks.find(queries1, function (err, result) {
                    result.forEach(function (todo) {
                        todoarr.push(...todo.todolist);
                    });
                    res.send(todoarr);
                }).populate("todolist").select("todolist");
            }
            else {
                console.log("user");
                var queries = { user_id: id, is_deleted: false };
                var todoarr = [];
                task_model_1.tasks.find(queries, function (err, result) {
                    result.forEach(function (todo) {
                        todoarr.push(...todo.todolist);
                    });
                    res.send(todoarr);
                }).populate("todolist").select("todolist");
            }
        });
    }
    completedTodoView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("completedTodoView");
            var admin = req.body.loginuser.is_admin;
            if (admin) {
                console.log("admin");
                var query = { task_id: req.body._id, status: true, is_deleted: false };
                todo_model_1.todos.find(query, function (err, result) {
                    res.send(result);
                });
            }
            else {
                console.log("user");
                var queries = { task_id: req.body._id, status: true, is_deleted: false };
                todo_model_1.todos.find(queries, function (err, result) {
                    res.send(result);
                });
            }
        });
    }
    deletedTodoView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("deletedTodoView");
            var admin = req.body.loginuser.is_admin;
            if (admin) {
                console.log("admin");
                var query = { is_deleted: true };
                todo_model_1.todos.find(query, function (err, result) {
                    res.send(result);
                });
            }
            else {
                console.log("user");
                var queries = { task_id: req.body._id, is_deleted: true };
                todo_model_1.todos.find(queries, function (err, result) {
                    res.send(result);
                });
            }
        });
    }
    pendingTodoView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("pendingTodoView");
            var admin = req.body.loginuser.is_admin;
            if (admin) {
                console.log("admin");
                var query = { task_id: req.body._id, status: false, is_deleted: false };
                todo_model_1.todos.find(query, function (err, result) {
                    res.send(result);
                });
            }
            else {
                console.log("user");
                var queries = { task_id: req.body._id, status: false, is_deleted: false };
                todo_model_1.todos.find(queries, function (err, result) {
                    res.send(result);
                });
            }
        });
    }
    todoDelete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("todoDelete");
            var update = yield todo_model_1.todos.updateMany({ _id: req.body._id }, { is_deleted: true });
            if (update) {
                res.send("Todo deleted successfully");
            }
        });
    }
    todoUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("todoUpdate");
            joi_1.default.validate(req.body, todo_validation_1.updateSchema).then(() => __awaiter(this, void 0, void 0, function* () {
                var myquery = { _id: req.body._id };
                var updates = yield todo_model_1.todos.updateOne(myquery, req.body);
                // , (err, results) => {
                // });
                if (updates) {
                    res.send("Todo updated successfully");
                }
            })).catch((e) => {
                res.send(e.details[0].message);
            });
        });
    }
}
exports.default = todoController;
//# sourceMappingURL=todo.controller.js.map