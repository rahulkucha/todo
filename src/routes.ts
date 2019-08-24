import {Express,Application} from 'express';
import TodoController from "./module/todo/todo.controller";
import userController from './module/users/user.controller';

export function registerRoutes(app: Application): void{
    new TodoController().register(app);
    new userController().register(app);
}