import type {Request, Response} from 'express';
import Project from "../models/Project";
import {Error} from "mongoose";

export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);
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
            const projects = await Project.find({});
            res.json(projects);
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Server Error'});
        }
    }

    static getProjectById = async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params
        try {
            const project = await Project.findById(id).populate('tasks')

            if (!project) {
                const error = new Error('Project not found!')
                res.status(400).json({error: error.message})
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

            await project.deleteOne();
            res.json('Project deleted successfully');
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Server Error'});
        }
    }
}