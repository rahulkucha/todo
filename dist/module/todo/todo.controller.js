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
const todo_model_1 = require("./todo.model");
const todo_validation_1 = require("./todo.validation");
const joi_1 = __importDefault(require("joi"));
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true });
class TodoController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.init();
    }
    register(express) {
        express.use('/todo', this.router);
    }
    init() {
        // this.router.get('/',this.index);
        this.router.post('/', this.TodoInsert);
        this.router.get('/', this.TodoView);
        this.router.delete('/', this.TodoDelete);
        this.router.put('/', this.TodoUpdate);
    }
    // public index(req: Request,res: Response): void{
    //     console.log("index");
    //     res.send("Hello World !!!");
    // }
    TodoInsert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("hi");
            console.log(req.body);
            const result = joi_1.default.validate(req.body, todo_validation_1.TodoSchema).then((data) => __awaiter(this, void 0, void 0, function* () {
                console.log(data);
                console.log(req.body);
                var add = yield todo_model_1.todos.insertMany([{ todo: req.body.todo, todo_id: req.body.todo_id }]);
                console.log("TodoInsert");
                res.send(yield todo_model_1.todos.find({}).then((data) => __awaiter(this, void 0, void 0, function* () {
                    res.send(data);
                })));
                // console.log(add);
            })).catch((e) => {
                console.log(e);
                // res.json({error: e.details[0].message});
                res.send(e.details[0].message);
            });
        });
    }
    TodoView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var view = yield todo_model_1.todos.find({}).then((data) => __awaiter(this, void 0, void 0, function* () {
                res.send(data);
            }));
            console.log("TodoView");
        });
    }
    TodoDelete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var del = yield todo_model_1.todos.deleteMany({ todo_id: req.body.todo_id });
            console.log(del);
            res.send(yield todo_model_1.todos.find({}).then((data) => __awaiter(this, void 0, void 0, function* () {
                res.send(data);
            })));
        });
    }
    TodoUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = joi_1.default.validate(req.body, todo_validation_1.TodoSchema).then((data) => __awaiter(this, void 0, void 0, function* () {
                var update = yield todo_model_1.todos.updateMany({ todo_id: req.body.todo_id }, { todo: req.body.todo });
                console.log(update);
                res.send(yield todo_model_1.todos.find({}).then((data) => __awaiter(this, void 0, void 0, function* () {
                    res.send(data);
                })));
            })).catch((e) => {
                res.send(e.details[0].message);
            });
        });
    }
}
exports.default = TodoController;
//# sourceMappingURL=todo.controller.js.map