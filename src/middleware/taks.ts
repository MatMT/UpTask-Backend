import {NextFunction, Request, Response} from "express";

export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
    if (req.user.id.toString() !== req.project.manager.toString()) {
        const error = new Error('You are not authorized to perform this action');
        res.status(400).json({error: error.message});
        return;
    }
    next();
}