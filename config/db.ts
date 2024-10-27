import moongose from 'mongoose';
import colors from 'colors';
import {exit} from 'node:process';

export const connectDB = async () => {
    try {
        const connection = await moongose.connect(process.env.DATABASE_URL);
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(colors.bold(`MongoDB connected: ${url}`));
    } catch (e) {
        console.log(colors.red.bold(`Error connecting to MongoDB: ${e.message}`));
        exit(1);
    }
}

