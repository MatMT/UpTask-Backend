import type {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import User from "../models/User";
import {checkPassword, hashPassword} from "../utils/auth";
import Token from "../models/Token";
import {generateSixToken} from "../utils/token";
import {transporter} from "../config/nodeMailer";
import {AuthEmail} from "../emails/AuthEmail";
import {generateJWT} from "../utils/jwt";

export class AuthController {
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
            res.send('Account confirmed successfully');
        } catch (error) {
            res.status(500).json({error: 'Server Error'});
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({email});

            if (!user) {
                const error = new Error("User doesn't exist");
                res.status(404).json({error: error.message});
                return
            }

            if (!user.confirmed) {
                const token = new Token();
                token.user = user.id;
                token.token = generateSixToken();

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                });

                await token.save();

                const error = new Error("The user account is not confirmed, we send you a confirmation email again.");
                res.status(401).json({error: error.message});
                return
            }

            // Check password
            const isPasswordCorrect = await checkPassword(password, user.password);

            if (!isPasswordCorrect) {
                const error = new Error('Invalid Password');
                res.status(401).json({error: error.message});
                return;
            }

            const token = generateJWT({id: user._id});
            res.send(token);

        } catch (error) {
            res.status(500).json({error: 'Server Error'})
        }
    }

    static resendConfirmationToken = async (req: Request, res: Response) => {
        try {
            const {email} = req.body;

            const userExists = await User.findOne({email})
            if (!userExists) {
                const error = new Error(`User doesn't exists`);
                res.status(404).json({error: error.message});
                return
            }

            if (userExists.confirmed) {
                const error = new Error(`User already confirmed`);
                res.status(403).json({error: error.message});
                return
            }

            // Token generation
            const token = new Token();
            token.token = generateSixToken();
            token.user = userExists.id;

            // Send email
            AuthEmail.sendConfirmationEmail({
                email: userExists.email,
                name: userExists.name,
                token: token.token
            });

            await Promise.allSettled([userExists.save(), token.save()]);

            res.send('Token sent successfully, check your email for confirmation');
        } catch (error) {
            res.status(500).json({error: "Hubo un error"});
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const {email} = req.body;

            const userExists = await User.findOne({email})
            if (!userExists) {
                const error = new Error(`User doesn't exists`);
                res.status(404).json({error: error.message});
                return
            }

            // Token generation
            const token = new Token();
            token.token = generateSixToken();
            token.user = userExists.id;
            await token.save();

            // Send email
            AuthEmail.sendPasswordResetToken({
                email: userExists.email,
                name: userExists.name,
                token: token.token
            });

            res.send('Token sent successfully, check your email for instructions');
        } catch (error) {
            res.status(500).json({error: "Hubo un error"});
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const {token} = req.body;
            const tokenExist = await Token.findOne({token});

            if (!tokenExist) {
                const error = new Error('Invalid Token')
                res.status(404).json({error: error.message});
                return;
            }

            res.send('Validate Token, define your new password.');
        } catch (error) {
            res.status(500).json({error: 'Server Error'});
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const {token} = req.params;
            const {password} = req.body;

            const tokenExist = await Token.findOne({token});
            if (!tokenExist) {
                const error = new Error('Invalid Token')
                res.status(401).json({error: error.message});
                return;
            }

            const user = await User.findById(tokenExist.user);
            user.password = await hashPassword(password);

            await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
            res.send('Password updated successfully.');
        } catch (error) {
            res.status(500).json({error: 'Server Error'});
        }
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user);
        return;
    }

    static updateProfile = async (req: Request, res: Response) => {
        try {
            const {email, name} = req.body || {};
            const userExist = await User.findOne({email});

            if(userExist) {
                const error = new Error('Email already exists');
                res.status(409).json({error: error.message});
                return;
            }

            if (email) req.user.email = email;
            if (name) req.user.name = name;

            await req.user.save();
            res.send('Profile updated successfully');
        } catch (error) {
            res.status(500).json({error: 'Server Error'});
        }
    }
}