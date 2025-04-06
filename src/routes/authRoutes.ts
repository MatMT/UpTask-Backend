import {Router} from 'express';
import {body, param} from "express-validator";
import {AuthController} from "../controllers/AuthController";
import {handleInputErrors} from "../middleware/validation";
import {authenticate} from "../middleware/auht";

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
    AuthController.createAccount
);

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuthController.confirmAccount
);

router.post('/login',
    body('email')
        .isEmail().withMessage('Invalid email'),
    body('password')
        .notEmpty().withMessage('Password cannot be empty'),
    handleInputErrors,
    AuthController.login
);

router.post('/resend-confirmation-token',
    body('email')
        .isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.resendConfirmationToken
);

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.forgotPassword
);

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuthController.validateToken
);

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('Token is required'),
    body('password')
        .isLength({min: 8}).withMessage('Password must be at least 8 characters'),
    body('password_confirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords are different')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
);

router.get('/user',
    authenticate,
    AuthController.user
)

// Profile

router.put('/update-profile',
    authenticate,
    handleInputErrors,
    AuthController.updateProfile
);

router.post('/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage("Current Password mustn't be empty"),
    body('password')
        .isLength({min: 8}).withMessage('The new Password must be at least 8 characters.'),
    body('password_confirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation is different')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
);

export default router;