import { Application } from "express";
import todoController from "./module/todos/todo.controller";
import userController from "./module/users/user.controller";
import taskController from "./module/tasks/task.controller";

export function registerRoutes(app: Application): void {
    new userController().register(app);
    new taskController().register(app);
    new todoController().register(app);
}