import jwt from 'jsonwebtoken';
import Types from 'mongoose';

type UserPayload = {
    id: Types.ObjectId;
}

export const generateJWT = (payload: UserPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
}