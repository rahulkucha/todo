import { Request, Response, Application } from "express";
import { BaseController } from "../base.controller";
import { tasks } from "./task.model";
import { obj } from "../../helper/helper";
import { taskSchema, updateTask } from "./task.validation";
import Joi, { ValidationError } from "joi";
import { todos } from "../todos/todo.model";

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/todo", { useNewUrlParser: true });


export default class taskController extends BaseController {
    constructor() {
        super();
        this.init();
    }

    public register(express: Application): void {
        express.use("/task", this.router);
    }

    public init(): void {
        this.router.post("/", obj.verify_Token, this.taskInsert);
        this.router.get("/view", obj.verify_Token, this.taskView);
        this.router.post("/inactive", obj.verify_Token, this.taskInActive);
        this.router.get("/deleted", obj.verify_Token, this.deletedTaskView);
        this.router.get("/completed", obj.verify_Token, this.completedTaskView);
        this.router.get("/pending", obj.verify_Token, this.pendingTaskView);
        this.router.delete("/", obj.verify_Token, this.taskDelete);
        this.router.put("/", obj.verify_Token, this.taskUpdate);
    }

    async taskInsert(req: Request, res: Response) {
        console.log("taskInsert");
        Joi.validate(req.body, taskSchema).then(async () => {
            var createdBy = req.body.loginuser.is_admin ? "admin" : "user";
            var updatedBy = req.body.loginuser.is_admin ? "admin" : "user";

            var user_id = req.body.user_id ? req.body.user_id : req.body.loginuser._id;

            var add = await tasks.insertMany({ name: req.body.name, description: req.body.description, user_id: user_id, created_by: createdBy, updated_by: updatedBy });
            if (add) {
                obj.sentMail();
                res.send("New task added successfully");
            }
        }).catch((e: ValidationError) => {
            console.log(e);
            res.send(e.details[0].message);
        });
    }

    async deletedTaskView(req: Request, res: Response) {
        console.log("deletedTaskView");
        var admin = req.body.loginuser.is_admin;
        if (admin) {
            console.log("admin");
            var query = { is_deleted: true };
            var deltask = await tasks.find(query).populate("todolist");
            res.send(deltask);
        }
        else {
            console.log("user");
            var queries = { user_id: req.body.loginuser._id, is_deleted: true };
            var deltask = await tasks.find(queries).populate("todolist");
            res.send(deltask);
        }
    }

    async completedTaskView(req: Request, res: Response) {
        console.log("completedTaskView");
        var admin = req.body.loginuser.is_admin;
        if (admin) {
            console.log("admin");
            await tasks.find().populate({ path: "todolist", match: { status: true, is_deleted: false } }).exec(function (err: any, results: any) {
                var taskarr: any = [];
                results.forEach(function (task: any) {
                    if (task.todolist.length > 0) {
                        taskarr.push(task);
                    }
                });
                res.send(taskarr);
            });
        }
        else {
            console.log("user");
            await tasks.find({ user_id: req.body.loginuser._id, is_deleted: false }).populate({ path: "todolist", match: { status: true, is_deleted: false } }).exec(function (err: any, results: any) {
                var taskarr: any = [];
                results.forEach(function (task: any) {
                    if (task.todolist.length > 0) {
                        taskarr.push(task);
                    }
                });
                res.send(taskarr);
            });
        }
    }

    async pendingTaskView(req: Request, res: Response) {
        console.log("pendingTaskView");
        var admin = req.body.loginuser.is_admin;
        if (admin) {
            console.log("admin");
            await tasks.find().populate({ path: "todolist", match: { status: false, is_deleted: false } }).exec(function (err: any, results: any) {
                var taskarr: any = [];
                results.forEach(function (task: any) {
                    if (task.todolist.length > 0) {
                        taskarr.push(task);
                    }
                });
                res.send(taskarr);
            });
        }
        else {
            console.log("user");
            await tasks.find({ user_id: req.body.loginuser._id, is_deleted: false }).populate({ path: "todolist", match: { status: false, is_deleted: false } }).exec(function (err: any, results: any) {
                var taskarr: any = [];
                results.forEach(function (task: any) {
                    if (task.todolist.length > 0) {
                        taskarr.push(task);
                    }
                });
                res.send(taskarr);
            });
        }
    }

    async taskView(req: Request, res: Response) {
        console.log("taskView");
        var admin = req.body.loginuser.is_admin;
        if (admin) {
            console.log("admin");
            var query = { is_deleted: false };
            var todoarr: any = [];
            tasks.find(query, await function (err: Error, result: any) {
                res.send(result);
            }).populate({ path: 'todolist', match: { is_deleted: false } });
        }
        else {
            console.log("user");
            var queries = { user_id: req.body.loginuser._id, is_deleted: false };
            tasks.find(queries, function (err: Error, result: any) {
                res.send(result);
            }).populate({ path: 'todolist', match: { is_deleted: false } });
        }
    }

    async taskDelete(req: Request, res: Response) {
        console.log("taskDelete");
        var checkTodo = await todos.find({ tasks: req.body._id, is_deleted: false, status: true });
        //, function (err, result) {
        //});
        var checkTodos = await todos.find({ tasks: req.body._id, is_deleted: false, status: false });
        //, function (err, result) {
        //});
        if (checkTodo.length > 0 && checkTodos.length > 0) {
            res.send("Task cannot be deleted since some todo of this task is completed");
        }
        else {
            var updatetask = await tasks.updateMany({ _id: req.body._id }, { is_deleted: true });
            var updatetodo = await todos.updateMany({ task_id: req.body._id }, { is_deleted: true });
            if (updatetask && updatetodo) {
                res.send("Task deleted successfully");
            }
        }
    }

    async taskUpdate(req: Request, res: Response) {
        console.log("taskUpdate");
        Joi.validate(req.body, updateTask).then(async () => {
            var updatedBy = req.body.loginuser.is_admin ? "admin" : "user";
            req.body.updated_by = updatedBy;
            var myquery = { _id: req.body._id };
            var updates = await tasks.updateOne(myquery, req.body);
            // , (err, results) => {
            // });
            if (updates) {
                res.send("Task updated successfully");
            }
        }).catch((e: ValidationError) => {
            res.send(e.details[0].message);
        });
    }

    async taskInActive(req: Request, res: Response) {
        console.log("taskInActive");
        Joi.validate(req.body, updateTask).then(async data => {
            const todos1 = await todos.find({ tasks: data._id, status: false }).count();
            if (todos1 > 0) {
                res.send("Cannot make this task inactive,since some todos of this task are pending");
            }
            else {
                var update = await tasks.updateOne({ _id: data._id }, { $set: { is_active: false } });
                res.send("Task made inactive successfully");
            }
        }).catch((e: ValidationError) => {
            res.send(e.details[0].message);
        });
    }
}