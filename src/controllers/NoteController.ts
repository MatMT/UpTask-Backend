import {Request, Response} from "express";
import Note, {INote} from "../models/Note";

export class NoteController {
    // Modificar Request con Generics
    // 1° Request Params Directory - Tipo de dato de la propiedad
    // 2° Res Body -
    // 3° Request Body -
    // 4° Request Query -
    static createNote = async (req: Request<{},{},INote>, res: Response) => {
        const {content} = req.body;
        const note = new Note();

        console.log(note);
    }
}