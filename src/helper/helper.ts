import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
var nodemailer = require("nodemailer");

export default class VerifyToken {
    upload: any;
    constructor() {
    }
    async verify_Token(req: Request, res: Response, next: any) {
        const bearerHeader = req.headers["authorization"];

        if (typeof bearerHeader !== "undefined") {

            const bearerToken = bearerHeader;

            await jwt.verify(bearerToken, "secretkey", (err, authData) => {
                if (err) {
                    res.sendStatus(403);
                }
                else {
                    req.body.loginuser = authData;
                }
            });
            next();
        } else {
            res.sendStatus(403);
        }
    }

    async verify_Admin(req: Request, res: Response, next: any) {
        var admin = req.body.loginuser.is_admin;
        console.log(admin);
        if (admin) {
            next();
        }
        else {
            res.send("Not Allowed !!!");
        }
    }

    public static isFile(): any {
        return multer({
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, "./uploads/");
                },
                filename: function (req, file, cb) {
                    var timestamp: any = Date.now();
                    cb(null, timestamp + file.originalname);
                }
            })
        });
    }

    public static fileFilter(req: any, file: any, cb: any) {
        console.log(file.mimetype);
        if (file.mimetype === ".jpeg" || file.mimetype === ".jpg" || file.mimetype === ".png") {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file format"), false);
        }
    }

    async sentMail() {
        console.log("sentMail");
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "rahulkucha@gmail.com",
                pass: ""
            }
        });

        var mailOptions = {
            from: "rahulkucha@gmail.com",
            to: "rahulkucha@gmail.com",
            subject: "Sending Email using Node.js",
            text: "New mail arrived !!!"
        };

        transporter.sendMail(mailOptions, function (error: any, info: any) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    }

}

var obj = new VerifyToken();
export { obj, VerifyToken };