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
class verifyToken {
    verify_Token(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                // const bearer = bearerHeader.split(' ');
                const bearerToken = bearerHeader;
                // req.token = bearerToken;
                yield jsonwebtoken_1.default.verify(bearerToken, 'secretkey', (err, authData) => {
                    if (err) {
                        res.sendStatus(403);
                    }
                    else {
                        req.body.loginUser = authData;
                        // res.send(await users.find({}).then(async data => {
                        // res.send(data);
                        // }));
                    }
                });
                next();
            }
            else {
                res.sendStatus(403);
            }
        });
    }
}
exports.default = verifyToken;
exports.obj = new verifyToken();
//# sourceMappingURL=helper.js.map