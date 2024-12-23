import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken';
import User, {IUser} from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        const error = new Error('Not authorized');
        res.status(401).send({error: error.message});
        return;
    }

    const token = bearer.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'object' && decoded.id) {
            const userExist = await User.findById(decoded.id).select('_id name email');

            if(userExist) {
                req.user = userExist;
            } else {
                res.status(500).json({error: 'Invalid Token'});
            }
        }

    } catch (error) {
        res.status(500).json({error: 'Server Error, Invalid Token'});
    }

    next();
}

