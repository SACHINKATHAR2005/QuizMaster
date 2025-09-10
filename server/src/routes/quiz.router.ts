import express from 'express';
import {authenticateToken } from '../middlewares/auth.middleware.js';
import { makeQuiz, quizScore, submitQuiz, getAllQuizData, getQuizById } from '../controllers/quiz.controller.js';
const router = express.Router();

// Generate new quiz
router.post("/generate", authenticateToken, makeQuiz);

// Get all quiz data - MUST come before /:id route!
router.get("/getall", authenticateToken, getAllQuizData);

// Get quiz results
router.get("/result/:id", authenticateToken, quizScore);

// Get a specific quiz by ID - MUST come LAST!
router.get("/:id", authenticateToken, getQuizById);

// Submit quiz answers
router.post("/submit", authenticateToken, submitQuiz);

export default router;