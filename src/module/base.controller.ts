import {Express,Router} from 'express';

export class BaseController {
    protected router: Router;

    constructor()
    {
        this.router = Router();
    }
}

