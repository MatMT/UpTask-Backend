import {Router} from 'express';
import {body} from "express-validator";
import {AuhtController} from "../controllers/AuhtController";
import {handleInputErrors} from "../middleware/validation";

const router = Router();

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('password')
        .isLength({min: 8}).withMessage('Password must be at least 8 characters'),
    body('password_confirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords are different')
        }
        return true
    }),
    body('email')
        .isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuhtController.createAccount
);

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuhtController.confirmAccount
);

router.post('/login',
    body('email')
        .isEmail().withMessage('Invalid email'),
    body('password')
        .notEmpty().withMessage('Password cannot be empty'),
    handleInputErrors,
    AuhtController.login
);

router.post('/resend-confirmation-token',
    body('email')
        .isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuhtController.resendConfirmationToken
);

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuhtController.forgotPassword
);

export default router;