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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
var nodemailer = require("nodemailer");
class VerifyToken {
    constructor() {
    }
    verify_Token(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const bearerHeader = req.headers["authorization"];
            if (typeof bearerHeader !== "undefined") {
                const bearerToken = bearerHeader;
                yield jsonwebtoken_1.default.verify(bearerToken, "secretkey", (err, authData) => {
                    if (err) {
                        res.sendStatus(403);
                    }
                    else {
                        req.body.loginuser = authData;
                    }
                });
                next();
            }
            else {
                res.sendStatus(403);
            }
        });
    }
    verify_Admin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var admin = req.body.loginuser.is_admin;
            console.log(admin);
            if (admin) {
                next();
            }
            else {
                res.send("Not Allowed !!!");
            }
        });
    }
    static isFile() {
        return multer_1.default({
            storage: multer_1.default.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, "./uploads/");
                },
                filename: function (req, file, cb) {
                    var timestamp = Date.now();
                    cb(null, timestamp + file.originalname);
                }
            })
        });
    }
    static fileFilter(req, file, cb) {
        console.log(file.mimetype);
        if (file.mimetype === ".jpeg" || file.mimetype === ".jpg" || file.mimetype === ".png") {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file format"), false);
        }
    }
    sentMail() {
        return __awaiter(this, void 0, void 0, function* () {
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
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("Email sent: " + info.response);
                }
            });
        });
    }
}
exports.default = VerifyToken;
exports.VerifyToken = VerifyToken;
var obj = new VerifyToken();
exports.obj = obj;
//# sourceMappingURL=helper.js.map