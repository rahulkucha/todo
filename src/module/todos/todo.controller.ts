import {Request,Response,Application} from 'express';
import { BaseController } from '../base.controller';
import { todos } from './todo.model';
import { TodoSchema, updateSchema } from './todo.validation';
import Joi, { ValidationError } from 'joi';
import { obj } from '../../helper/helper';
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo', {useNewUrlParser: true});

export default class todoController extends BaseController{
    constructor(){
        super();
        this.init();
    }

    public register(express: Application): void{
       express.use('/todo',this.router);
    }   

    public init(): void {
        this.router.post('/',obj.verify_Token,this.todoInsert);
        this.router.post('/view',obj.verify_Token,this.todoView);
        this.router.post('/completed',obj.verify_Token,this.completedTodoView);
        this.router.post('/pending',obj.verify_Token,this.pendingTodoView);
        this.router.post('/deleted',obj.verify_Token,this.deletedTodoView);
        this.router.delete('/',obj.verify_Token,this.todoDelete);
        this.router.put('/',obj.verify_Token,this.todoUpdate);
    }
    
    async todoInsert(req: Request,res: Response,next: any) {
        console.log("todoInsert");
        const result = Joi.validate(req.body, TodoSchema).then(async data => {

            var add = await todos.insertMany({ name: req.body.name, description: req.body.description, task_id: req.body._id, is_deleted: req.body.is_deleted });
            if(add)
            {
                res.send("New todo added successfully");
            }   
        }).catch((e: ValidationError) => {
            console.log(e);
            res.send(e.details[0].message);
        });
    }

    async todoView(req: Request,res: Response){
        console.log("todoView");
        var admin = req.body.loginuser.is_admin;
            if(admin)
            {
                console.log("admin");
                var query = { is_deleted: false };
                    todos.find(query, function(err: Error, result: any) {
                    res.send(result);
                });
            }
            else
            {
                console.log("user");
                var queries = { task_id: req.body._id, is_deleted: false };
                todos.find(queries, function(err: Error, result: any) {
                    res.send(result);
                });
            }
    }

    async completedTodoView(req: Request,res: Response){
        console.log("completedTodoView");
        var admin = req.body.loginuser.is_admin;
            if(admin)
            {
                console.log("admin");
                var query = { task_id: req.body._id, status: true, is_deleted: false };
                    todos.find(query, function(err: Error, result: any) {
                    res.send(result);
                });
            }
            else
            {
                console.log("user");
                var queries = { task_id: req.body._id, status: true, is_deleted: false };
                todos.find(queries, function(err: Error, result: any) {
                    res.send(result);
                });
            }
    }

    async deletedTodoView(req: Request,res: Response){
        console.log("deletedTodoView");
        var admin = req.body.loginuser.is_admin;
            if(admin)
            {
                console.log("admin");
                var query = { is_deleted: true };
                    todos.find(query, function(err: Error, result: any) {
                    res.send(result);
                });
            }
            else
            {
                console.log("user");
                var queries = { task_id: req.body._id, is_deleted: true };
                todos.find(queries, function(err: Error, result: any) {
                    res.send(result);
                });
             }
    }

    async pendingTodoView(req: Request,res: Response){
        console.log("pendingTodoView");
        var admin = req.body.loginuser.is_admin;
            if(admin)
            {
                console.log("admin");
                var query = { task_id: req.body._id, status: false, is_deleted: false };
                    todos.find(query, function(err: Error, result: any) {
                    res.send(result);
                });
            }
            else
            {
                console.log("user");
                var queries = { task_id: req.body._id, status: false, is_deleted: false };
                todos.find(queries, function(err: Error, result: any) {
                    res.send(result);
                });
             }
    }

    async todoDelete(req: Request,res: Response){
        console.log("todoDelete");
        var update = await todos.updateMany({ _id: req.body._id },{ is_deleted: true });
        if(update)
        {
            res.send("Todo deleted successfully");
        }
    }

    async todoUpdate(req: Request,res: Response){
        console.log("todoUpdate");
        const result = Joi.validate(req.body, updateSchema).then(async data => {
            var myquery = { _id: req.body._id };
            var updates = todos.updateOne(myquery,req.body,(err,results) => {
            });
            if(updates)
            {
                res.send("Todo updated successfully");
            }
        }).catch ((e: ValidationError) => {
            res.send(e.details[0].message);        
        });
    }
}