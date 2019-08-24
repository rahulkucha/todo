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
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true });
class userController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.init();
    }
    register(express) {
        express.use('/user', this.router);
    }
    init() {
        this.router.post('/login', this.login);
        this.router.post('/', helper_1.obj.verify_Token, this.userAdd);
        this.router.get('/', helper_1.obj.verify_Token, this.userView);
        this.router.delete('/', helper_1.obj.verify_Token, this.userDelete);
        this.router.put('/', helper_1.obj.verify_Token, this.userUpdate);
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("login");
            const result = joi_1.default.validate(req.body, user_validation_1.userSchema).then((data) => __awaiter(this, void 0, void 0, function* () {
                jsonwebtoken_1.default.sign({ email: req.body.email, password: req.body.password }, 'secretkey', { expiresIn: '1h' }, (error, token) => {
                    res.json({
                        token: token
                    });
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
            var timestamp = Date.now();
            const result = joi_1.default.validate(req.body, user_validation_1.userSchema).then((data) => __awaiter(this, void 0, void 0, function* () {
                var numSaltRounds = 10;
                bcrypt_1.default.genSalt(numSaltRounds, yield function (err, salt) {
                    return __awaiter(this, void 0, void 0, function* () {
                        bcrypt_1.default.hash('req.body.password', salt, yield function (err, hash) {
                            console.log(hash);
                            var add = user_model_1.users.insertMany({ name: req.body.name, email: req.body.email, password: req.body.password, created_at: timestamp, created_by: name, updated_at: timestamp, updated_by: name });
                        });
                    });
                });
            })).catch((e) => {
                console.log(e);
                res.send(e.details[0].message);
            });
        });
    }
    userView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body.loginUser);
            console.log("userView");
            var view = yield user_model_1.users.find({}).then((data) => __awaiter(this, void 0, void 0, function* () {
                res.send(data);
            }));
        });
    }
    userDelete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("userDelete");
            var del = yield user_model_1.users.deleteMany({ email: req.body.email });
            res.send(yield user_model_1.users.find({}).then((data) => __awaiter(this, void 0, void 0, function* () {
                res.send(data);
            })));
        });
    }
    userUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("userUpdate");
            const result = joi_1.default.validate(req.body, user_validation_1.userSchema).then((data) => __awaiter(this, void 0, void 0, function* () {
                var update = yield user_model_1.users.update({ email: req.body.email }, { password: req.body.password });
                res.send(yield user_model_1.users.find({}).then((data) => __awaiter(this, void 0, void 0, function* () {
                    res.send(data);
                })));
            })).catch((e) => {
                res.send(e.details[0].message);
            });
        });
    }
}
exports.default = userController;
//# sourceMappingURL=user.controller.js.map