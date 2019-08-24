import {Express,Application,Request,Response} from 'express';
import jwt from 'jsonwebtoken';

export default class verifyToken
{
    async verify_Token(req: Request, res: Response, next: any) {
        const bearerHeader = req.headers['authorization'];

        if(typeof bearerHeader !== 'undefined'){
            // const bearer = bearerHeader.split(' ');
            const bearerToken = bearerHeader;
        // req.token = bearerToken;
            await jwt.verify(bearerToken,'secretkey', (err,authData)=>{
                if(err)
                {
                    res.sendStatus(403);
                } 
                else 
                {
                    req.body.loginUser = authData;
                    // res.send(await users.find({}).then(async data => {
                    // res.send(data);
                    // }));
                }
            });
            next();
        } else {
            res.sendStatus(403);
        }
    }
}
export var obj = new verifyToken();