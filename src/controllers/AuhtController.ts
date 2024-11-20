import type {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import User from "../models/User";
import {hashPassword} from "../utils/auth";

export class AuhtController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const {password, email} = req.body;

            // Prevent duplicates
            const userExists = await User.findOne({email})
            if (userExists) {
                const error = new Error(`User already exists`);
                res.status(409).json({error: error.message});
                return
            }

            const user = new User(req.body);
            // Hash Password
            user.password = await hashPassword(password);
            await user.save();

            res.send('Account created successfully, check your email for confirmation');
        } catch (error) {
            res.status(500).json({error: "Hubo un error"});
        }
    }
}