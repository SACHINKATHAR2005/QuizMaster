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
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL || 'https://quizmaster-iota-seven.vercel.app',
        'https://quizmaster-iota-seven.vercel.app',
        'https://*.vercel.app'
      ]
    : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list or matches vercel pattern
        if (allowedOrigins.some(allowed => 
            allowed === origin || 
            (allowed.includes('*.vercel.app') && origin.endsWith('.vercel.app'))
        )) {
            return callback(null, true);
        }
        
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    optionsSuccessStatus: 200
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