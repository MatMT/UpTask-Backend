import {Request, Response} from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const {email} = req.body;
        const user = await User.findOne({email}).select('id email name');

        if (!user) {
            const error = new Error("User doesn't exist");
            res.status(404).json({message: error.message});
            return;
        }

        res.json(user);
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        const { team } = await req.project.populate('team', 'id name email')
        res.status(200).json(team);
    }

    static addMemberById = async (req: Request, res: Response) => {
        const {id} = req.body;
        const user = await User.findById(id).select('id');

        if (!user) {
            const error = new Error("User doesn't exist");
            res.status(404).json({message: error.message});
            return;
        }

        if (req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error("The user already exist in this project");
            res.status(404).json({message: error.message});
            return;
        }

        req.project.team.push(user.id);
        await req.project.save();

        res.json('User added successfully');
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const {userId} = req.params;

        if (!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error("The user does not exist in this project.");
            res.status(404).json({message: error.message});
            return;
        }

        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId);
        await req.project.save();
        res.send('User removed successfully');
    }
}