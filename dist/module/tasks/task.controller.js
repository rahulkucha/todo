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
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true });
class taskController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.init();
    }
    register(express) {
        express.use('/task', this.router);
    }
    init() {
        this.router.post('/', helper_1.obj.verify_Token, this.taskInsert);
        this.router.get('/', helper_1.obj.verify_Token, this.taskView);
        this.router.delete('/', helper_1.obj.verify_Token, this.taskDelete);
        this.router.put('/', helper_1.obj.verify_Token, this.taskUpdate);
    }
    taskInsert(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("taskInsert");
            const result = joi_1.default.validate(req.body, task_validation_1.taskSchema).then((data) => __awaiter(this, void 0, void 0, function* () {
                var add = yield task_model_1.tasks.insertMany({ name: req.body.name, description: req.body.description, user_id: req.body.loginuser._id });
                if (add) {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'youremail@gmail.com',
                            pass: 'yourpassword'
                        }
                    });
                    var mailOptions = {
                        from: 'youremail@gmail.com',
                        to: 'myfriend@yahoo.com',
                        subject: 'Sending Email using Node.js',
                        text: 'That was easy!'
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    res.send("New task added successfully");
                }
            })).catch((e) => {
                console.log(e);
                res.send(e.details[0].message);
            });
        });
    }
    taskView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("taskView");
            var admin = req.body.loginuser.is_admin;
            if (admin) {
                console.log("admin");
                var query = { is_deleted: false };
                task_model_1.tasks.find(query, function (err, result) {
                    res.send(result);
                });
            }
            else {
                console.log("user");
                var queries = { user_id: req.body.loginuser._id, is_deleted: false };
                task_model_1.tasks.find(queries, function (err, result) {
                    res.send(result);
                });
            }
        });
    }
    taskDelete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("taskDelete");
            var checkToDo = yield todo_model_1.todos.find({ task_id: req.body._id, is_deleted: false, status: true }, function (err, result) {
            });
            if (checkToDo.length > 0) {
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
            const result = joi_1.default.validate(req.body, task_validation_1.updateTask).then((data) => __awaiter(this, void 0, void 0, function* () {
                var myquery = { _id: req.body._id };
                var updates = task_model_1.tasks.updateOne(myquery, req.body, (err, results) => {
                });
                if (updates) {
                    res.send("Task updated successfully");
                }
            })).catch((e) => {
                res.send(e.details[0].message);
            });
        });
    }
}
exports.default = taskController;
//# sourceMappingURL=task.controller.js.map