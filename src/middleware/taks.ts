import {NextFunction, Request, Response} from "express";
import Task, {ITask} from "../models/Task";

// Task will be part of global statement of Request
declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExists(req: Request, res: Response, next: NextFunction) {
    try {
        const {taskId} = req.params;
        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error('Task not found!');
            res.status(400).json({error: error.message});
        }
        req.task = task;
        next();
    } catch (error) {
        res.status(500).json({error: 'Server Error'});
    }
}

export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
    if (req.user.id.toString() !== req.project.manager.toString()) {
        const error = new Error('You are not authorized to perform this action');
        res.status(400).json({error: error.message});
        return;
    }
    next();
}
