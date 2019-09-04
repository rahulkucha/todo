import {Request,Response,Application} from 'express';
import { BaseController } from '../base.controller';
import { tasks } from './task.model';
import { obj } from '../../helper/helper';
import { taskSchema, updateTask } from './task.validation';
import Joi, { ValidationError } from 'joi';
import { ObjectId } from 'bson';
import { todos } from '../todos/todo.model';
var nodemailer = require('nodemailer');

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
        this.router.get('/',obj.verify_Token,this.taskView);
        this.router.delete('/',obj.verify_Token,this.taskDelete,);
        this.router.put('/',obj.verify_Token,this.taskUpdate);
    }
    
    async taskInsert(req: Request,res: Response,next: any) {
        console.log("taskInsert");
        const result = Joi.validate(req.body, taskSchema).then(async data => {

            var add = await tasks.insertMany({ name: req.body.name, description: req.body.description, user_id: req.body.loginuser._id });
            if(add)
            {
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
                  
                  transporter.sendMail(mailOptions, function(error: any, info: any){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                res.send("New task added successfully");
            }
        }).catch((e: ValidationError) => {
            console.log(e);
            res.send(e.details[0].message);
        });
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
        var checkToDo = await todos.find({task_id: req.body._id, is_deleted: false, status: true},function(err,result){
        });
        if(checkToDo.length>0)
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