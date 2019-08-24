//var express = require('express');
import {Request,Response,Application} from 'express';
import { BaseController } from '../base.controller';
import { todos,tasks } from './todo.model';
import { TodoSchema } from './todo.validation';
import Joi, { ValidationError } from 'joi';
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo', {useNewUrlParser: true});


export default class TodoController extends BaseController{
    constructor(){
        super();
        this.init();
    }

    public register(express: Application): void{
       express.use('/todo',this.router);
    }   

    public init(): void {
       // this.router.get('/',this.index);
        this.router.post('/',this.TodoInsert);
        this.router.get('/',this.TodoView);
        this.router.delete('/',this.TodoDelete);
        this.router.put('/',this.TodoUpdate);
    }

    // public index(req: Request,res: Response): void{
    //     console.log("index");
    //     res.send("Hello World !!!");
    // }
    
    async TodoInsert(req: Request,res: Response) {
        console.log("hi");
        console.log(req.body);
        const result = Joi.validate(req.body, TodoSchema).then(async data => {
             console.log(data);
             console.log(req.body);
             var add = await todos.insertMany([{todo: req.body.todo, todo_id: req.body.todo_id}]);   
             console.log("TodoInsert");
             res.send(await todos.find({}).then(async data => {
                 res.send(data);
             }));
            // console.log(add);
        }).catch((e: ValidationError) => {
            console.log(e);
           // res.json({error: e.details[0].message});
            res.send(e.details[0].message);
        });
    }

    async TodoView(req: Request,res: Response){
        var view = await todos.find({}).then(async data => {
            res.send(data);
        }); 
        console.log("TodoView");
    }

    async TodoDelete(req: Request,res: Response){
        var del = await todos.deleteMany({todo_id: req.body.todo_id});
        console.log(del);
        res.send(await todos.find({}).then(async data => {
            res.send(data);
        }));
    }

    async TodoUpdate(req: Request,res: Response){
        const result = Joi.validate(req.body, TodoSchema).then(async data => {
            var update = await todos.updateMany({todo_id: req.body.todo_id},{todo: req.body.todo});
            console.log(update);
            res.send(await todos.find({}).then(async data => {
                res.send(data);
            }));
        }).catch ((e: ValidationError) => {
            res.send(e.details[0].message);        
        });
    }
}