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
const task_model_1 = require("./task.model");
const helper_1 = require("../../helper/helper");
const task_validation_1 = require("./task.validation");
const joi_1 = __importDefault(require("joi"));
const todo_model_1 = require("../todos/todo.model");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/todo", { useNewUrlParser: true });
class taskController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.init();
    }
    register(express) {
        express.use("/task", this.router);
    }
    init() {
        this.router.post("/", helper_1.obj.verify_Token, this.taskInsert);
        this.router.get("/view", helper_1.obj.verify_Token, this.taskView);
        this.router.post("/inactive", helper_1.obj.verify_Token, this.taskInActive);
        this.router.get("/deleted", helper_1.obj.verify_Token, this.deletedTaskView);
        this.router.get("/completed", helper_1.obj.verify_Token, this.completedTaskView);
        this.router.get("/pending", helper_1.obj.verify_Token, this.pendingTaskView);
        this.router.delete("/", helper_1.obj.verify_Token, this.taskDelete);
        this.router.put("/", helper_1.obj.verify_Token, this.taskUpdate);
    }
    taskInsert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("taskInsert");
            joi_1.default.validate(req.body, task_validation_1.taskSchema).then(() => __awaiter(this, void 0, void 0, function* () {
                var createdBy = req.body.loginuser.is_admin ? "admin" : "user";
                var updatedBy = req.body.loginuser.is_admin ? "admin" : "user";
                var user_id = req.body.user_id ? req.body.user_id : req.body.loginuser._id;
                var add = yield task_model_1.tasks.insertMany({ name: req.body.name, description: req.body.description, user_id: user_id, created_by: createdBy, updated_by: updatedBy });
                if (add) {
                    helper_1.obj.sentMail();
                    res.send("New task added successfully");
                }
            })).catch((e) => {
                console.log(e);
                res.send(e.details[0].message);
            });
        });
    }
    deletedTaskView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("deletedTaskView");
            var admin = req.body.loginuser.is_admin;
            if (admin) {
                console.log("admin");
                var query = { is_deleted: true };
                var deltask = yield task_model_1.tasks.find(query).populate("todolist");
                res.send(deltask);
            }
            else {
                console.log("user");
                var queries = { user_id: req.body.loginuser._id, is_deleted: true };
                var deltask = yield task_model_1.tasks.find(queries).populate("todolist");
                res.send(deltask);
            }
        });
    }
    completedTaskView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("completedTaskView");
            var admin = req.body.loginuser.is_admin;
            if (admin) {
                console.log("admin");
                yield task_model_1.tasks.find().populate({ path: "todolist", match: { status: true, is_deleted: false } }).exec(function (err, results) {
                    var taskarr = [];
                    results.forEach(function (task) {
                        if (task.todolist.length > 0) {
                            taskarr.push(task);
                        }
                    });
                    res.send(taskarr);
                });
            }
            else {
                console.log("user");
                yield task_model_1.tasks.find({ user_id: req.body.loginuser._id, is_deleted: false }).populate({ path: "todolist", match: { status: true, is_deleted: false } }).exec(function (err, results) {
                    var taskarr = [];
                    results.forEach(function (task) {
                        if (task.todolist.length > 0) {
                            taskarr.push(task);
                        }
                    });
                    res.send(taskarr);
                });
            }
        });
    }
    pendingTaskView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("pendingTaskView");
            var admin = req.body.loginuser.is_admin;
            if (admin) {
                console.log("admin");
                yield task_model_1.tasks.find().populate({ path: "todolist", match: { status: false, is_deleted: false } }).exec(function (err, results) {
                    var taskarr = [];
                    results.forEach(function (task) {
                        if (task.todolist.length > 0) {
                            taskarr.push(task);
                        }
                    });
                    res.send(taskarr);
                });
            }
            else {
                console.log("user");
                yield task_model_1.tasks.find({ user_id: req.body.loginuser._id, is_deleted: false }).populate({ path: "todolist", match: { status: false, is_deleted: false } }).exec(function (err, results) {
                    var taskarr = [];
                    results.forEach(function (task) {
                        if (task.todolist.length > 0) {
                            taskarr.push(task);
                        }
                    });
                    res.send(taskarr);
                });
            }
        });
    }
    taskView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("taskView");
            var admin = req.body.loginuser.is_admin;
            if (admin) {
                console.log("admin");
                var query = { is_deleted: false };
                var todoarr = [];
                task_model_1.tasks.find(query, yield function (err, result) {
                    res.send(result);
                }).populate({ path: 'todolist', match: { is_deleted: false } });
            }
            else {
                console.log("user");
                var queries = { user_id: req.body.loginuser._id, is_deleted: false };
                task_model_1.tasks.find(queries, function (err, result) {
                    res.send(result);
                }).populate({ path: 'todolist', match: { is_deleted: false } });
            }
        });
    }
    taskDelete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("taskDelete");
            var checkTodo = yield todo_model_1.todos.find({ tasks: req.body._id, is_deleted: false, status: true });
            //, function (err, result) {
            //});
            var checkTodos = yield todo_model_1.todos.find({ tasks: req.body._id, is_deleted: false, status: false });
            //, function (err, result) {
            //});
            if (checkTodo.length > 0 && checkTodos.length > 0) {
                res.send("Task cannot be deleted since some todo of this task is completed");
            }
            else {
                var updatetask = yield task_model_1.tasks.updateMany({ _id: req.body._id }, { is_deleted: true });
                var updatetodo = yield todo_model_1.todos.updateMany({ task_id: req.body._id }, { is_deleted: true });
                if (updatetask && updatetodo) {
                    res.send("Task deleted successfully");
                }
            }
        });
    }
    taskUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("taskUpdate");
            joi_1.default.validate(req.body, task_validation_1.updateTask).then(() => __awaiter(this, void 0, void 0, function* () {
                var updatedBy = req.body.loginuser.is_admin ? "admin" : "user";
                req.body.updated_by = updatedBy;
                var myquery = { _id: req.body._id };
                var updates = yield task_model_1.tasks.updateOne(myquery, req.body);
                // , (err, results) => {
                // });
                if (updates) {
                    res.send("Task updated successfully");
                }
            })).catch((e) => {
                res.send(e.details[0].message);
            });
        });
    }
    taskInActive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("taskInActive");
            joi_1.default.validate(req.body, task_validation_1.updateTask).then((data) => __awaiter(this, void 0, void 0, function* () {
                const todos1 = yield todo_model_1.todos.find({ tasks: data._id, status: false }).count();
                if (todos1 > 0) {
                    res.send("Cannot make this task inactive,since some todos of this task are pending");
                }
                else {
                    var update = yield task_model_1.tasks.updateOne({ _id: data._id }, { $set: { is_active: false } });
                    res.send("Task made inactive successfully");
                }
            })).catch((e) => {
                res.send(e.details[0].message);
            });
        });
    }
}
exports.default = taskController;
//# sourceMappingURL=task.controller.js.map