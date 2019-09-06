import {Express,Application,Request,Response} from 'express';
import jwt from 'jsonwebtoken';
import { Double } from 'bson';
import multer from 'multer';
import { users } from '../module/users/user.model';
var nodemailer = require('nodemailer');

export default class verifyToken
{
    upload: any;
    constructor() {
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

    async getStorage() {
        return await multer.diskStorage({
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
        console.log(admin);
        if(admin)
        {
            next();
        }
        else
        {
            res.send("Not Allowed !!!");
        }
    }

    public static  isFile() : any{
        return  multer({ storage: multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, './uploads/' );
            },
            filename: function(req, file, cb) {
                var timestamp: any = Date.now();
                cb(null, timestamp + file.originalname );
            }
        })  });
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

    async sentMail(id:string)
    {
        // console.log(id);
        // users.findOne({_id: id},function(err,result: any){
        //     console.log(result.email);
        // });
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'rahulkucha100@gmail.com',
              pass: 'yourpassword'
            }
          });
          
          var mailOptions = {
            from: 'rahulkucha100@gmail.com',
            to: 'rahulkucha100@gmail.com', // usermail,adminmail
            subject: 'Sending Email using Node.js',
            text: 'New mail arrived !!!'
          };
          
          transporter.sendMail(mailOptions, function(error: any, info: any){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }

}
var obj = new verifyToken()
export { obj , verifyToken };