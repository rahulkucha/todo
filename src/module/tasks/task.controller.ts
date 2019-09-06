import {Request,Response,Application} from 'express';
import { BaseController } from '../base.controller';
import { tasks } from './task.model';
import { obj } from '../../helper/helper';
import { taskSchema, updateTask } from './task.validation';
import Joi, { ValidationError } from 'joi';
import { ObjectId } from 'bson';
import { todos } from '../todos/todo.model';

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo', {useNewUrlParser: true});


export default class taskController extends BaseController{
    constructor(){
        super();
        this.init();
    }

    public register(express: Application): void{
       express.use('/task',this.router);
    }   

    public init(): void {
        this.router.post('/',obj.verify_Token,this.taskInsert);
        this.router.post('/view',obj.verify_Token,this.taskView);
        this.router.post('/deleted',obj.verify_Token,this.deletedTaskView);
        this.router.post('/completed',obj.verify_Token,this.completedTaskView);
        this.router.post('/pending',obj.verify_Token,this.pendingTaskView);
        this.router.delete('/',obj.verify_Token,this.taskDelete,);
        this.router.put('/',obj.verify_Token,this.taskUpdate);
    }
    
    async taskInsert(req: Request,res: Response,next: any) {
        console.log("taskInsert");
        const result = Joi.validate(req.body, taskSchema).then(async data => {
            var createdBy = req.body.loginuser.is_admin ? "admin" : "user";
            var updatedBy = req.body.loginuser.is_admin ? "admin" : "user";

            var user_id = req.body.user_id ? req.body.user_id : req.body.loginuser._id;

            var add = await tasks.insertMany({ name: req.body.name, description: req.body.description, user_id: user_id, created_by: createdBy, updated_by: updatedBy });
            if(add)
            {    
                obj.sentMail(user_id);
                res.send("New task added successfully");
            }
        }).catch((e: ValidationError) => {
            console.log(e);
            res.send(e.details[0].message);
        });
    }

    async deletedTaskView(req: Request,res: Response){
        console.log("deletedTaskView");
        var admin = req.body.loginuser.is_admin;
            if(admin)
            {
                console.log("admin");
                var query = { is_deleted: true };
                    tasks.find(query, await function(err: Error, result: any) {
                    res.send(result);
                });
            }
            else
            {
                console.log("user");
                var queries = { user_id: req.body._id, is_deleted: true };
                tasks.find(queries, await function(err: Error, result: any) {
                    res.send(result);
                });
             }
    }

    async completedTaskView(req: Request,res: Response){
        console.log("completedTaskView");
        var admin = req.body.loginuser.is_admin;
            if(admin)
            {
                console.log("admin");
                var query = { user_id: req.body._id, status: true, is_deleted: false };
                    todos.find(query, await function(err: Error, result: any) {
                    res.send(result);
                });
            }
            else
            {
                console.log("user");
                // var checkTodo = await todos.find({task_id: req.body._id, is_deleted: false, status: true},function(err,result){
                // });
                var checkTodos = await todos.find({task_id: req.body._id, is_deleted: false, status: false},function(err,result){
                });
                if(checkTodos.length>0)
                {
                    var queries = { user_id: req.body._id, is_deleted: false };
                    tasks.find(queries, await function(err: Error, result: any) {
                        res.send(result);
                    });
                }
            }
    }

    async pendingTaskView(req: Request,res: Response){
        console.log("pendingTaskView");
        var admin = req.body.loginuser.is_admin;
            if(admin)
            {
                console.log("admin");
                var query = { user_id: req.body._id, status: false, is_deleted: false };
                    todos.find(query, function(err: Error, result: any) {
                    res.send(result);
                });
            }
            else
            {
                console.log("user");
                var queries = { user_id: req.body._id, status: false, is_deleted: false };
                    todos.find(queries, function(err: Error, result: any) {
                    res.send(result);
                });
            }
    }

    async taskView(req: Request,res: Response){
        console.log("taskView");
        var admin = req.body.loginuser.is_admin;
            if(admin)
            {
                console.log("admin");
                var query = { is_deleted: false };
                    tasks.find(query, function(err: Error, result: any) {
                    res.send(result);
                });
            }
            else
            {
                console.log("user");
                var queries = { user_id: req.body.loginuser._id, is_deleted: false };
                    tasks.find(queries, function(err: Error, result: any) {
                    res.send(result);
                });
            }
    }

    async taskDelete(req: Request,res: Response){
        console.log("taskDelete");
        var checkTodo = await todos.find({task_id: req.body._id, is_deleted: false, status: true},function(err,result){
        });
        var checkTodos = await todos.find({task_id: req.body._id, is_deleted: false, status: false},function(err,result){
        });
        if(checkTodo.length>0 && checkTodos.length>0)
        {
            res.send("Task cannot be deleted since some todo of this task is completed");
        }
        else
        {
            var updatetask = await tasks.updateMany({ _id: req.body._id },{ is_deleted: true });
            var updatetodo = await todos.updateMany({ task_id: req.body._id },{ is_deleted: true });
            if(updatetask && updatetodo)
            {
                res.send("Task deleted successfully");
            }
        }
    }

    async taskUpdate(req: Request,res: Response){
        console.log("taskUpdate");
        const result = Joi.validate(req.body, updateTask).then(async data => {
            var updatedBy = req.body.loginuser.is_admin ? "admin" : "user";
            var myquery = { _id: req.body._id };
            var updates = tasks.updateOne(myquery,req.body,(err,results) => {
            });
            if(updates)
            {
                res.send("Task updated successfully");
            }
        }).catch ((e: ValidationError) => {
            res.send(e.details[0].message);        
        });
    }
}