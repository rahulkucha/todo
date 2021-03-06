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
const user_model_1 = require("./user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helper_1 = require("../../helper/helper");
const user_validation_1 = require("./user.validation");
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/todo", { useNewUrlParser: true });
class userController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.init();
    }
    register(express) {
        express.use("/user", this.router);
    }
    init() {
        this.router.post("/register", helper_1.VerifyToken.isFile().single("profile_image"), this.registerUser);
        this.router.post("/login", this.login);
        this.router.post("/", helper_1.obj.verify_Token, helper_1.obj.verify_Admin, this.userAdd);
        this.router.get("/", helper_1.obj.verify_Token, this.userView);
        this.router.get("/inactive", helper_1.obj.verify_Token, this.inactiveUser);
        this.router.delete("/", helper_1.obj.verify_Token, helper_1.obj.verify_Admin, this.userDelete);
        this.router.put("/", helper_1.VerifyToken.isFile().single("profile_image"), this.userUpdate);
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("registerUser");
            joi_1.default.validate(req.body, user_validation_1.registerSchema).then((data) => __awaiter(this, void 0, void 0, function* () {
                var query = { email: data.email };
                user_model_1.users.findOne(query, function (err, result) {
                    if (result != null && data.email === result.email) {
                        res.send("Invalid email !!!");
                    }
                    else {
                        var numSaltRounds = 10;
                        bcrypt_1.default.genSalt(numSaltRounds, function (err, salt) {
                            return __awaiter(this, void 0, void 0, function* () {
                                bcrypt_1.default.hash(req.body.password, numSaltRounds, function (err, hash) {
                                    var isAdmin = req.body.is_admin ? "admin" : "user";
                                    var updatedBy = req.body.is_admin ? "admin" : "user";
                                    var checkfile = req.file == undefined ? null : req.file.path;
                                    user_model_1.users.insertMany({ name: req.body.name, email: req.body.email, password: hash, profile_image: checkfile, created_by: isAdmin, is_admin: req.body.is_admin, updated_by: updatedBy });
                                    res.send("Registration Successfull !!!");
                                });
                            });
                        });
                    }
                });
            })).catch((e) => {
                res.send(e.details[0].message);
            });
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("login");
            joi_1.default.validate(req.body, user_validation_1.userSchema).then((data) => __awaiter(this, void 0, void 0, function* () {
                var query = { email: data.email, is_active: true };
                user_model_1.users.findOne(query, yield function (err, result) {
                    //console.log(result);
                    if (result === null) {
                        res.send("Un-registered user,Invalid-Email,In-active user");
                    }
                    else {
                        var same = bcrypt_1.default.compareSync(data.password, result.password);
                        if (same) {
                            jsonwebtoken_1.default.sign({ _id: result._id, email: result.email, is_admin: result.is_admin }, "secretkey", { expiresIn: "2h" }, (error, token) => {
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
            })).catch((e) => {
                console.log(e);
                res.send(e.details[0].message);
            });
        });
    }
    userAdd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("userAdd");
            joi_1.default.validate(req.body, user_validation_1.registerSchema).then(() => __awaiter(this, void 0, void 0, function* () {
                var numSaltRounds = 10;
                bcrypt_1.default.genSalt(numSaltRounds, yield function (err, salt) {
                    return __awaiter(this, void 0, void 0, function* () {
                        bcrypt_1.default.hash(req.body.password, salt, yield function (err, hash) {
                            //console.log(hash);
                            user_model_1.users.insertMany({ name: req.body.name, email: req.body.email, password: hash, created_by: "admin" });
                        });
                    });
                });
                res.send("New user added successfully by admin");
            })).catch((e) => {
                console.log(e);
                res.send(e.details[0].message);
            });
        });
    }
    userView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("userView");
            var admin = req.body.loginuser.is_admin;
            if (admin) {
                yield user_model_1.users.find({}).then((data) => __awaiter(this, void 0, void 0, function* () {
                    res.send(data);
                }));
            }
            else {
                var query = { _id: req.body.loginuser._id };
                user_model_1.users.findOne(query, function (err, result) {
                    res.send(result);
                });
            }
        });
    }
    inactiveUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("inactiveUser");
            var admin = req.body.loginuser.is_admin;
            if (admin) {
                yield user_model_1.users.find({ is_active: false }).then((data) => __awaiter(this, void 0, void 0, function* () {
                    res.send(data);
                }));
            }
        });
    }
    userDelete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("userDelete");
            yield user_model_1.users.deleteMany({ _id: req.body._id });
            res.send(yield user_model_1.users.find({}).then((data) => __awaiter(this, void 0, void 0, function* () {
                res.send(data);
            })));
        });
    }
    userUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("userUpdate");
            console.log(req.body);
            joi_1.default.validate(req.body, user_validation_1.updateSchema).then(() => __awaiter(this, void 0, void 0, function* () {
                var myquery = { _id: req.body._id };
                console.log(myquery);
                if (req.body.name) {
                    var newvalue = { $set: { name: req.body.name } };
                    yield user_model_1.users.updateOne(myquery, newvalue, function (err, res) {
                        if (err)
                            throw err;
                        console.log("hi" + res);
                    });
                }
                if (req.body.email) {
                    var newvalues = { $set: { email: req.body.email } };
                    yield user_model_1.users.updateOne(myquery, newvalues, function (err, res) {
                        if (err)
                            throw err;
                        console.log("hi" + res);
                    });
                }
                if (req.body.is_active) {
                    console.log("reqis_active");
                    user_model_1.users.updateOne({ _id: req.body._id }, { is_active: req.body.is_active }, yield function (err, res) {
                        console.log(res);
                    });
                }
                if (req.file) {
                    console.log("reqfile");
                    console.log(req.file);
                    var checkfiles = req.file == undefined ? null : req.file.path;
                    user_model_1.users.updateOne(myquery, { profile_image: checkfiles });
                }
                if (req.body.loginuser.is_admin === true) {
                    user_model_1.users.updateOne(myquery, { is_active: req.body.is_active, updated_by: "admin" });
                }
                else {
                    user_model_1.users.updateOne(myquery, { updated_by: "user" });
                }
                if (req.body.password) {
                    var numSaltRounds = 10;
                    bcrypt_1.default.genSalt(numSaltRounds, yield function (err, salt) {
                        return __awaiter(this, void 0, void 0, function* () {
                            bcrypt_1.default.hash(req.body.password, salt, yield function (err, hash) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    req.body.password = hash;
                                    yield user_model_1.users.updateOne(myquery, req.body);
                                });
                            });
                        });
                    });
                }
            })).catch((e) => {
                console.log(e);
                res.send(e.details[0].message);
            });
            yield res.send("User updated successfully");
        });
    }
}
exports.default = userController;
//# sourceMappingURL=user.controller.js.map