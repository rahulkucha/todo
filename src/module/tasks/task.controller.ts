import {Request,Response,Application} from 'express';
import { BaseController } from '../base.controller';
import { tasks } from './task.model';
import { obj } from '../../helper/helper';
import { taskSchema } from './task.validation';
import Joi, { ValidationError } from 'joi';
import { ObjectId } from 'bson';

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
        this.router.post('/',obj.verify_Token,this.taskInsert,this.taskView);
        this.router.get('/',obj.verify_Token,this.taskView);
        this.router.delete('/',obj.verify_Token,this.taskDelete,);
        this.router.put('/',obj.verify_Token,this.taskUpdate);
    }
    
    async taskInsert(req: Request,res: Response,next: any) {
        console.log("taskInsert");
        console.log(req.body.loginuser._id);
        const result = Joi.validate(req.body, taskSchema).then(async data => {

            var add = await tasks.insertMany({ name: req.body.name, description: req.body.description, user_id: req.body.loginuser._id });
            
        }).catch((e: ValidationError) => {
            console.log(e);
            res.send(e.details[0].message);
        });
        next();
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
        var update = await tasks.updateMany({ _id: req.body._id },{ is_deleted: true });
        var query = { is_deleted: false };
        tasks.find(query, function(err: Error, result: any) {
            console.log(result);
            res.send(result);
        });
    }

    async taskUpdate(req: Request,res: Response){
        console.log("taskUpdate");
        const result = Joi.validate(req.body, taskSchema).then(async data => {
            var update = await tasks.updateMany({ name: req.body.name },{ description: req.body.description });
            console.log(update);
            res.send(await tasks.find({}).then(async data => {
                res.send(data);
            }));
        }).catch ((e: ValidationError) => {
            res.send(e.details[0].message);        
        });
    }
}