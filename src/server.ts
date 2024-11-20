import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {corsConfig} from "./config/cors";
import {connectDB} from "./config/db";
import projectRoutes from "./routes/projectRoutes";
import authRoutes from "./routes/authRoutes";
import morgan from "morgan";

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
app.use(cors(corsConfig ))

// Logging
app.use(morgan('dev'))

// Enable read express.json
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes)
app.use('/api/auth', authRoutes)

export default app;