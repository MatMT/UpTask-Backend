import type {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import User from "../models/User";
import {hashPassword} from "../utils/auth";
import Token from "../models/Token";
import {generateSixToken} from "../utils/token";
import {transporter} from "../config/nodeMailer";
import {AuthEmail} from "../emails/AuthEmail";

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

            // Token generation
            const token = new Token();
            token.token = generateSixToken();
            token.user = user.id;

            // Send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });

            await Promise.allSettled([user.save(), token.save()]);

            res.send('Account created successfully, check your email for confirmation');
        } catch (error) {
            res.status(500).json({error: "Hubo un error"});
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const {token} = req.body;
            const tokenExist = await Token.findOne({token});
            if (!tokenExist) {
                const error = new Error('Invalid Token')
                res.status(401).json({error: error.message});
                return;
            }

            const user = await User.findById(tokenExist.user);
            user.confirmed = true;

            await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
            res.send('Account confirmed successfully, check your email for confirmation');
        } catch (error) {
            res.status(500).json({error: 'Server Error'});
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({email});
            if(!user) {
                const error = new Error("User doesn't exist");
                res.status(401).json({error: error.message});
                return
            }
        } catch (error) {
            res.status(500).json({error: 'Server Error'})
        }
    }
}