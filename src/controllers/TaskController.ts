import type {Request, Response} from 'express';
import Project from "../models/Project";
import Task from "../models/Task";
import {validateTaskBelongsToProject} from "../helpers/taskValidation";

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body);

            task.project = req.project.id;
            req.project.tasks.push(task.id);

            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Task created successfully');
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Server Error'});
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({project: req.project.id}).populate('project');
            res.json(tasks);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Server Error'});
        }
    }

    static getTaskById = async (req: Request, res: Response): Promise<void> => {
        try {
            const {taskId} = req.params;
            const task = await validateTaskBelongsToProject(taskId, req.project.id, res);
            if (!task) return;

            res.json(task);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Server Error'});
        }
    }

    static updateTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const {taskId} = req.params;
            const task = await validateTaskBelongsToProject(taskId, req.project.id, res);
            if (!task) return;

            Object.assign(task, req.body);
            await task.save();
            res.send('Task updated successfully');
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Server Error'});
        }
    }

    static deleteTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const {taskId} = req.params;
            const task = await validateTaskBelongsToProject(taskId, req.project.id, res);
            if (!task) return;

            req.project.tasks = req.project.tasks.filter(task => task.toString() !== taskId);

            await Promise.allSettled([task.deleteOne(), req.project.save()]);
            res.send('Task deleted successfully');
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Server Error'});
        }
    }

    static updateStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const {taskId} = req.params;
            const {status} = req.body;
            const task = await validateTaskBelongsToProject(taskId, req.project.id, res);
            if (!task) return;

            task.status = status;
            await task.save();
            res.send('Task status updated successfully');
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Server Error'});
        }
    }
}