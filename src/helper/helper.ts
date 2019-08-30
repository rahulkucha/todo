import {Express,Application,Request,Response} from 'express';
import jwt from 'jsonwebtoken';
import { Double } from 'bson';
import multer from 'multer';

export default class verifyToken
{
    upload: any;
    constructor() {
        this.upload = multer({ storage: this.getStorage(), fileFilter: this.fileFilter });
    }
    async verify_Token(req: Request, res: Response, next: any) {
        const bearerHeader = req.headers['authorization'];

        if(typeof bearerHeader !== 'undefined'){
            
            const bearerToken = bearerHeader;
            
            const temp = await jwt.verify(bearerToken,'secretkey', (err,authData)=>{
                if(err)
                {
                    res.sendStatus(403);
                }
                else
                {
                    req.body.loginuser = authData;
                }
            });
            next();
        } else {
            res.sendStatus(403);
        }
    }

    getStorage() {
        return multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, './uploads/' );
            },
            filename: function(req, file, cb) {
                var timestamp: any = Date.now();
                cb(null, timestamp + file.originalname );
            }
        });
    }

    async verify_Admin(req: Request, res: Response, next: any) {
        var admin = req.body.loginuser.is_admin;
        if(admin)
        {
            next();
        }
        else
        {
            res.send("Not Allowed !!!");
        }
    }

    fileFilter (req: any, file: any, cb: any) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' ||  file.mimetype === 'image/png')
        {
            cb(null, true);
        }
        else
        {
            cb(new Error('Invalid file format'), false);
        }
    }
}

export var obj = new verifyToken();