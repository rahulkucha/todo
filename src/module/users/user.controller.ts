import {Request,Response,Application} from 'express';
import { BaseController } from '../base.controller';
import { users } from './user.model';
import jwt from 'jsonwebtoken';
import { obj } from '../../helper/helper';
import { userSchema, registerSchema, updateSchema } from './user.validation';
import Joi, { ValidationError } from 'joi';
import { getMaxListeners } from 'cluster';
import bcrypt, { hash }  from 'bcrypt';
import multer from 'multer';

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
        this.router.post('/register',obj.upload.single('profile_image'),this.registerUser);
        this.router.post('/login',this.login);
        this.router.post('/',obj.verify_Token,obj.verify_Admin,this.userAdd);
        this.router.get('/',obj.verify_Token,this.userView);
        this.router.delete('/',obj.verify_Token,obj.verify_Admin,this.userDelete);
        this.router.put('/',obj.verify_Token,obj.upload.single('profile_image'),this.userUpdate);
    }
    
    async registerUser(req: Request,res: Response)
    {
        console.log("registerUser");
        const result = Joi.validate(req.body, registerSchema).then(async data => {
            var query = { email: data.email };
            users.findOne(query, function(err: Error, result: any) {
                if (result != null && data.email === result.email)
                {
                    res.send("Invalid email !!!");
                }
                else
                {
                    var numSaltRounds = 10;
                    bcrypt.genSalt(numSaltRounds, async function(err, salt) {
                        bcrypt.hash(req.body.password,numSaltRounds, function(err, hash) {
                            var isAdmin = req.body.is_admin ? "admin" : "user";
                            var updatedBy = req.body.is_admin ? "admin" : "user";
                            var add = users.insertMany({name: req.body.name, email: req.body.email, password: hash, created_by: isAdmin, is_admin: req.body.is_admin, profile_image: req.file.path, updated_by: updatedBy });
                            res.send("Registration Successfull !!!");
                        });
                    })
                }
           });
        }).catch((e: ValidationError) => {
            res.send(e.details[0].message);
            });
    }

    async login(req: Request,res: Response) 
    {
        console.log("login");
        const result = Joi.validate(req.body, userSchema).then(async data => {
            var query = {email: data.email, is_active: true };
            users.findOne(query,function(err: Error, result: any) {
                if (result === null)
                {
                    res.send("Un-registered user,Invalid-Email,In-active user");
                }
                else
                {
                    var same = bcrypt.compareSync(data.password, result.password);
                        if(same)
                        {
                            jwt.sign({ _id: result._id,email: result.email, is_admin: result.is_admin},'secretkey', { expiresIn: '1h' } ,(error: any,token: any)=>{
                                res.json({
                                    token: token
                                });
                            });
                        }
                        else
                        {
                            res.send("Invalid-Password");
                        }
                }
            })
        }).catch((e: ValidationError) => {
            console.log(e);
            res.send(e.details[0].message);
         });
    }

    async userAdd(req: Request,res: Response)
    {
        console.log("userAdd");
            const result = Joi.validate(req.body, registerSchema).then(async data => {
                var numSaltRounds = 10;
                bcrypt.genSalt(numSaltRounds,await async function(err, salt) {
                    bcrypt.hash(req.body.password, salt, await function(err, hash) {
                        console.log(hash);
                        var add = users.insertMany({name: req.body.name, email: req.body.email, password: hash, is_admin: req.body.is_admin, created_by: "admin" });
                    });
                });
                var view = await users.find({}).then(async data => {
                    res.send(data);
                });
            }).catch((e: ValidationError) => {
                    console.log(e);
                    res.send(e.details[0].message);
                });
    }

    async userView(req: Request,res: Response){
        console.log("userView");
        var admin = req.body.loginuser.is_admin;
        if(admin)
        {
            var view = await users.find({}).then(async data => {
                res.send(data);
            });
        }
        else
        {
            var query = { _id: req.body.loginuser._id };
            users.findOne(query,function(err: Error, result: any) {
                res.send(result);
            });
        }
    }

    async userDelete(req: Request,res: Response){
        console.log("userDelete");
            var del = await users.deleteMany({ _id: req.body._id });
            res.send(await users.find({}).then(async data => {
                res.send(data);
            }));
    }

    async userUpdate(req: Request,res: Response){
        console.log("userUpdate");
        console.log(req.body);
        const result = Joi.validate(req.body, updateSchema).then(async data => {
            var myquery = req.body.loginuser.is_admin ? { _id: req.body._id } : { _id: req.body.loginuser._id };
            if(req.file)
            {
                console.log(req.file);
                users.updateOne(myquery,{ profile_image: req.file.path },(err,results) => {          
                });           
            }
            if(req.body.loginuser.is_admin === false)
            {
                req.body.is_active = true;
            }
            if(req.body.password)
            {
                var numSaltRounds = 10;
                bcrypt.genSalt(numSaltRounds,await async function(err, salt) {
                    bcrypt.hash(req.body.password, salt, await function(err, hash) {
                        req.body.password = hash;
                        users.updateOne(myquery,req.body,(err,results) => {
                        });        
                    });
                });
            }
            else
            {
                users.updateOne(myquery,req.body,(err,results) => {
                });
            }                
            
        }).catch((e: ValidationError) => {
                console.log(e);
                res.send(e.details[0].message);
            });

            var admin = req.body.loginuser.is_admin;
            if(admin)
            {
                var view = await users.find({}).then(async data => {
                    res.send(data);
                });
            }
            else
            {
                var query = { _id: req.body.loginuser._id };
                users.findOne(query,function(err: Error, result: any) {
                    res.send(result);
                });
            }

    }
}