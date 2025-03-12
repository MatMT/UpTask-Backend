import {Request, Response} from "express";
import Note, {INote} from "../models/Note";
import {validateTaskBelongsToProject} from "../helpers/taskValidation";
import {Types} from "mongoose";

type NoteParams = {
    noteId: Types.ObjectId;
}

export class NoteController {
    // Modificar Request con Generics
    // 1° Request Params Directory - Tipo de dato de la propiedad
    // 2° Res Body -
    // 3° Request Body -
    // 4° Request Query -
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const {content} = req.body;
        const note = new Note();

        // Set Note values
        note.content = content;
        note.createdBy = req.user.id;
        note.task = req.task.id;

        // Push note related to Task
        req.task.notes.push(note.id);
        try {
            // Save await for double settle
            await Promise.allSettled([note.save(), req.task.save()]);
            res.send('Note Created Successfully.');
        } catch (e) {
            res.status(500).send({error: 'Server Error'});
        }
    }

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({task: req.task.id});
            res.send(notes);
        } catch (e) {
            res.status(500).send({error: 'Server Error'});
        }

    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        const {noteId} = req.params;
        const note = await Note.findById(noteId);

        if (!note) {
            const error = new Error('Note not found!');
            res.status(404).json({error: error.message});
            return;
        }

        if (note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('You are not authorized');
            res.status(401).send({error: error.message});
            return;
        }

        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString());

        try {
            await Promise.allSettled([req.task.save(), note.deleteOne()]);
            res.send('Note deleted successfully');
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Server Error'});
        }
    }
}