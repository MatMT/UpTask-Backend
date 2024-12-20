import fs from 'fs';
import path from 'path';
import {transporter} from "../config/nodeMailer";

interface IEmail {
    email: string;
    name: string;
    token: string;
}

export class AuthEmail {
    static getStyles(): string {
        // Read styles from a CSS file
        const stylesPath = path.join(__dirname, './styles/email-confirmation.css');
        return fs.readFileSync(stylesPath, 'utf8');
    }

    static sendConfirmationEmail = async ({email, name, token}: IEmail) => {
        const styles = AuthEmail.getStyles();
        const htmlContent = AuthEmail.getConfirmationEmailHtml(name, token, styles);

        await transporter.sendMail({
            from: "UpTask <admin@uptask.com>",
            to: email,
            subject: `UpTask - ${name}, Confirm Your Account`,
            text: `Hi ${name}, confirm your account by visiting the following link: http://localhost:5173/${token}`,
            html: htmlContent,
        });
    }

    static sendPasswordResetToken = async ({email, name, token}: IEmail) => {
        const styles = AuthEmail.getStyles();
        const htmlContent = AuthEmail.getPasswordResetEmailHtml(name, token, styles);

        await transporter.sendMail({
            from: "UpTask <admin@uptask.com>",
            to: email,
            subject: `UpTask - ${name}, Reset Your Password`,
            text: `Hi ${name}, reset your password by visiting the following link: ${process.env.FRONTEND_URL}/auth/reset-password`,
            html: htmlContent,
        });
    }

    static getPasswordResetEmailHtml(name: string, token: string, styles: string): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
                ${styles ?? ""}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>Password Reset Request, ${name}</h1>
                </div>
                <div class="email-body">
                    <p class="font-bold">Note: This password reset link is valid for only 15 minutes!</p>
                    <p>We received a request to reset the password for your UpTask account. Click the button below to proceed:</p>
                    <a class="cta-button" href="${process.env.FRONTEND_URL}/auth/reset-password" target="_blank" rel="noreferrer">
                        Reset Password
                    </a>
                    <p>If the button above doesn't work, copy and paste the link below into your browser:</p>
                    <p><strong>${token}</strong></p>
                    <p><a href="${process.env.FRONTEND_URL}/auth/reset-password" target="_blank" rel="noreferrer">${process.env.FRONTEND_URL}/auth/reset-password</a></p>
                    <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                </div>
                <div class="email-footer">
                    <p>&copy; 2024 UpTask. All rights reserved.</p>
                    <p>Need help? Contact us at <a href="mailto:support@uptask.com">support@uptask.com</a></p>
                </div>
            </div>
        </body>
        </html>
    `;
    }

    static getConfirmationEmailHtml(name: string, token: string, styles: string): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirm Your Account</title>
                <style>
                    ${styles ?? ""}
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <h1>Welcome to UpTask, ${name}!</h1>
                    </div>
                    <div class="email-body">
                        <p class="font-bold">Note: The confirmation is available only for the next 15 minutes!</p>
                        <p>We're excited to have you on board! Please confirm your account to start managing your tasks efficiently.</p>
                        <a class="cta-button" href="${process.env.FRONTEND_URL}/auth/confirm-account" target="_blank" rel="noreferrer">
                            Confirm My Account
                        </a>
                        <p>If the button above doesn't work, copy and paste the link below into your browser:</p>
                        <p><strong>${token}</strong></p>
                        <p><a href="${process.env.FRONTEND_URL}/auth/confirm-account" target="_blank" rel="noreferrer">${process.env.FRONTEND_URL}/auth/confirm-account</a></p>
                    </div>
                    <div class="email-footer">
                        <p>&copy; 2024 UpTask. All rights reserved.</p>
                        <p>Need help? Contact us at <a href="mailto:support@uptask.com">support@uptask.com</a></p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
}

