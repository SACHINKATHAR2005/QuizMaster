import dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import { connectDb } from './Db/db.js';
import authRouter from './routes/user.router.js';
import quizRouter from "./routes/quiz.router.js"
import codeRouter from "./routes/code.router.js"
import fileRouter from './routes/file.router.js';
import challengeRouter from './routes/challenge.router.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();
app.use(cookieParser());
connectDb();

// CORS configuration - allow requests from the frontend
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use("/auth",authRouter);
app.use("/quiz",quizRouter)
app.use("/code",codeRouter)
app.use("/file",fileRouter)
app.use("/challenges",challengeRouter)


const port = process.env.PORT || 4000

app.listen(port,()=>{
    // Server started successfully
})