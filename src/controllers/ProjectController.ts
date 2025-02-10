import type {Request, Response} from 'express';
import Project from "../models/Project";
import {Error} from "mongoose";

export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);

        // Manager assigment
        project.manager = req.user.id;

        try {
            await project.save();
            res.send('Project created successfully');
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Server Error'});
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user.id}}, // If the user is the manager
                    {team: {$in: req.user.id}} // If the user is in the team
                ]
            });
            res.json(projects);
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Server Error'});
        }
    }

    static getProjectById = async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params
        try {
            const project = await Project.findById(id).
                    populate({path: 'tasks', populate: {path: 'completedBy.user', select: '_id name email'}});

            if (!project) {
                const error = new Error('Project not found!')
                res.status(404).json({error: error.message})
                return
            }

            // Check if the user is the manager or in the team
            if (project.manager.toString() !== req.user.id.toString()
                && !project.team.includes(req.user.id.toString())) {
                const error = new Error('Invalid Action!')
                res.status(404).json({error: error.message})
                return
            }
            res.json(project)
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Server Error'});
        }
    }

    static updateProject = async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params
        try {
            const project = await Project.findByIdAndUpdate(id, req.body)

            if (!project) {
                const error = new Error('Project not found!')
                res.status(400).json({error: error.message})
                return
            }
            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Invalid Action!')
                res.status(404).json({error: error.message})
                return
            }
            await project.save();
            res.json('Project updated successfully');
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Server Error'});
        }
    }

    static deleteProject = async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params
        try {
            const project = await Project.findByIdAndDelete(id, req.body)

            if (!project) {
                const error = new Error('Project not found!')
                res.status(400).json({error: error.message})
                return
            }
            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Invalid Action!')
                res.status(404).json({error: error.message})
                return
            }
            await project.deleteOne();
            res.json('Project deleted successfully');
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Server Error'});
        }
    }
}