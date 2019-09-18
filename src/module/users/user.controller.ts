import { Request, Response, Application } from "express";
import { BaseController } from "../base.controller";
import { users } from "./user.model";
import jwt from "jsonwebtoken";
import { obj, VerifyToken } from "../../helper/helper";
import { userSchema, registerSchema, updateSchema } from "./user.validation";
import Joi, { ValidationError } from "joi";
import bcrypt from "bcrypt";
import multer from "multer";

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/todo", { useNewUrlParser: true });

export default class userController extends BaseController {
    constructor() {
        super();
        this.init();
    }

    public register(express: Application): void {
        express.use("/user", this.router);
    }

    public init(): void {
        this.router.post("/register", VerifyToken.isFile().single("profile_image"), this.registerUser);
        this.router.post("/login", this.login);
        this.router.post("/", obj.verify_Token, obj.verify_Admin, this.userAdd);
        this.router.get("/", obj.verify_Token, this.userView);
        this.router.get("/inactive", obj.verify_Token, this.inactiveUser);
        this.router.delete("/", obj.verify_Token, obj.verify_Admin, this.userDelete);
        this.router.put("/", VerifyToken.isFile().single("profile_image"), this.userUpdate);
    }

    async registerUser(req: Request, res: Response) {
        console.log("registerUser");
        Joi.validate(req.body, registerSchema).then(async data => {
            var query = { email: data.email };
            users.findOne(query, function (err: Error, result: any) {
                if (result != null && data.email === result.email) {
                    res.send("Invalid email !!!");
                }
                else {
                    var numSaltRounds = 10;
                    bcrypt.genSalt(numSaltRounds, async function (err, salt) {
                        bcrypt.hash(req.body.password, numSaltRounds, function (err, hash) {
                            var isAdmin = req.body.is_admin ? "admin" : "user";
                            var updatedBy = req.body.is_admin ? "admin" : "user";
                            var checkfile = req.file == undefined ? null : req.file.path;
                            users.insertMany({ name: req.body.name, email: req.body.email, password: hash, profile_image: checkfile, created_by: isAdmin, is_admin: req.body.is_admin, updated_by: updatedBy });
                            res.send("Registration Successfull !!!");
                        });
                    });
                }
            });
        }).catch((e: ValidationError) => {
            res.send(e.details[0].message);
        });
    }

    async login(req: Request, res: Response) {
        console.log("login");
        Joi.validate(req.body, userSchema).then(async data => {
            var query = { email: data.email, is_active: true };
            users.findOne(query, await function (err: Error, result: any) {
                //console.log(result);
                if (result === null) {
                    res.send("Un-registered user,Invalid-Email,In-active user");
                }
                else {
                    var same = bcrypt.compareSync(data.password, result.password);
                    if (same) {
                        jwt.sign({ _id: result._id, email: result.email, is_admin: result.is_admin }, "secretkey", { expiresIn: "2h" }, (error: any, token: any) => {
                            res.json({
                                token: token
                            });
                        });
                    }
                    else {
                        res.send("Invalid-Password");
                    }
                }
            });
        }).catch((e: ValidationError) => {
            console.log(e);
            res.send(e.details[0].message);
        });
    }

    async userAdd(req: Request, res: Response) {
        console.log("userAdd");
        Joi.validate(req.body, registerSchema).then(async () => {
            var numSaltRounds = 10;
            bcrypt.genSalt(numSaltRounds, await async function (err, salt) {
                bcrypt.hash(req.body.password, salt, await function (err, hash) {
                    //console.log(hash);
                    users.insertMany({ name: req.body.name, email: req.body.email, password: hash, created_by: "admin" });
                });
            });
            res.send("New user added successfully by admin");
        }).catch((e: ValidationError) => {
            console.log(e);
            res.send(e.details[0].message);
        });
    }

    async userView(req: Request, res: Response) {
        console.log("userView");
        var admin = req.body.loginuser.is_admin;
        if (admin) {
            await users.find({}).then(async data => {
                res.send(data);
            });
        }
        else {
            var query = { _id: req.body.loginuser._id };
            users.findOne(query, function (err: Error, result: any) {
                res.send(result);
            });
        }
    }

    async inactiveUser(req: Request, res: Response) {
        console.log("inactiveUser");
        var admin = req.body.loginuser.is_admin;
        if (admin) {
            await users.find({ is_active: false }).then(async data => {
                res.send(data);
            });
        }
    }

    async userDelete(req: Request, res: Response) {
        console.log("userDelete");
        await users.deleteMany({ _id: req.body._id });
        res.send(await users.find({}).then(async data => {
            res.send(data);
        }));
    }

    async userUpdate(req: Request, res: Response) {
        console.log("userUpdate");
        console.log(req.body);
        Joi.validate(req.body, updateSchema).then(async () => {

            var myquery = { _id: req.body._id };
            console.log(myquery);

            if (req.body.name) {
                var newvalue = { $set: { name: req.body.name } };
                await users.updateOne(myquery, newvalue, function (err, res) {
                    if (err) throw err;
                    console.log("hi" + res);
                });
            }

            if (req.body.email) {
                var newvalues = { $set: { email: req.body.email } };
                await users.updateOne(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("hi" + res);
                });
            }

            if (req.body.is_active) {
                console.log("reqis_active");
                users.updateOne({ _id: req.body._id }, { is_active: req.body.is_active }, await function (err, res) {
                    console.log(res);
                });
            }

            if (req.file) {
                console.log("reqfile");
                console.log(req.file);
                var checkfiles = req.file == undefined ? null : req.file.path;
                users.updateOne(myquery, { profile_image: checkfiles });
            }

            if (req.body.loginuser.is_admin === true) {
                users.updateOne(myquery, { is_active: req.body.is_active, updated_by: "admin" });
            }
            else {
                users.updateOne(myquery, { updated_by: "user" });
            }

            if (req.body.password) {
                var numSaltRounds = 10;
                bcrypt.genSalt(numSaltRounds, await async function (err, salt) {
                    bcrypt.hash(req.body.password, salt, await async function (err, hash) {
                        req.body.password = hash;
                        await users.updateOne(myquery, req.body);
                    });
                });
            }
        }).catch((e: ValidationError) => {
            console.log(e);
            res.send(e.details[0].message);
        });
        await res.send("User updated successfully");
    }
}