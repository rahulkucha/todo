import {Request,Response,Application} from 'express';
import { BaseController } from '../base.controller';
import { users } from './user.model';
import jwt from 'jsonwebtoken';
import { obj } from '../../helper/helper';
import { userSchema } from './user.validation';
import Joi, { ValidationError } from 'joi';
import { getMaxListeners } from 'cluster';
import bcrypt, { hash }  from 'bcrypt';

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo', {useNewUrlParser: true});

export default class userController extends BaseController{
    constructor(){
        super();
        this.init();
    }
    
    public register(express: Application): void{
       express.use('/user',this.router);
    }   

    public init(): void {
        this.router.post('/login',this.login);
        this.router.post('/', obj.verify_Token,this.userAdd);
        this.router.get('/',obj.verify_Token,this.userView);
        this.router.delete('/',obj.verify_Token,this.userDelete);
        this.router.put('/',obj.verify_Token,this.userUpdate);
    }
    
    async login(req: Request,res: Response) 
    {
        console.log("login");
        const result = Joi.validate(req.body, userSchema).then(async data => {

            jwt.sign({email: req.body.email, password: req.body.password},'secretkey', { expiresIn: '1h' } ,(error: any,token: any)=>{
                res.json({
                    token: token
                });
            });

        }).catch((e: ValidationError) => {
            console.log(e);
            res.send(e.details[0].message);
        });
    }

    async userAdd(req: Request,res: Response){
        console.log("userAdd");
        var timestamp = Date.now();
        const result = Joi.validate(req.body, userSchema).then(async data => {
            var numSaltRounds = 10;
            bcrypt.genSalt(numSaltRounds,await async function(err, salt) {
                bcrypt.hash('req.body.password',salt,await function(err, hash) {
                    console.log(hash);
                    var add = users.insertMany({name: req.body.name, email: req.body.email, password: req.body.password, created_at: timestamp,created_by: name, updated_at: timestamp,updated_by: name});
                });
            });
        }).catch((e: ValidationError) => {
            console.log(e);
            res.send(e.details[0].message);
         });
    }

    async userView(req: Request,res: Response){
        console.log(req.body.loginUser);
        console.log("userView");
        var view = await users.find({}).then(async data => {
            res.send(data);
        });
    }

    async userDelete(req: Request,res: Response){
        console.log("userDelete");
        var del = await users.deleteMany({email: req.body.email});
        res.send(await users.find({}).then(async data => {
            res.send(data);
        }));
    }

    async userUpdate(req: Request,res: Response){
        console.log("userUpdate");
            const result = Joi.validate(req.body, userSchema).then(async data => {
            var update = await users.update({email:req.body.email},{password: req.body.password});
            res.send(await users.find({}).then(async data => {
                res.send(data);
            }));
        }).catch ((e: ValidationError) => {
            res.send(e.details[0].message);        
        });
    }


}