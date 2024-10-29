import { Response } from 'express';
import Task from '../models/Task';

/**
 * Validate if task exists and if it belongs to the project
 * @param taskId
 * @param projectId
 * @param res
 */
export const validateTaskBelongsToProject = async (taskId: string, projectId: string, res: Response) => {
    const task = await Task.findById(taskId);

    if (!task) {
        res.status(404).json({ error: 'Task not found!' });
        return null;
    }

    if (task.project.toString() !== projectId) {
        res.status(400).json({ error: 'Denied access to this task' });
        return null;
    }

    return task;
};