import moongose, {Schema, Document, Types} from 'mongoose';

// El modelo se llama Note
// por lo tanto no podemos usar el nombre Note para la interfaz
export interface INote extends Document {
    content: string;
    createdBy: Types.ObjectId;
    task: Types.ObjectId;
}

const NoteSchema : Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        referer: 'User',
        required: true
    },
    task: {
        type: Types.ObjectId,
        referer: 'Task',
        required: true
    }
},{timestamps: true});

const Note = moongose.model<INote>('Note', NoteSchema)
export default Note;