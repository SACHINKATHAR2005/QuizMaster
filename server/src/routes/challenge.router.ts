import express from 'express';
import { generateAIChallenge, evaluateCode, getChallenges, getChallenge } from '../controllers/challenge.controller.js';
import { analyzeCodeController } from '../controllers/codeAnalysisController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';


const router = express.Router();

// Get all challenges
router.get('/', authenticateToken, getChallenges);

// Get single challenge
router.get('/:id', authenticateToken, getChallenge);

// Generate a new challenge
router.post('/generate', authenticateToken, generateAIChallenge);

// Evaluate user's solution
router.post('/evaluate', authenticateToken, evaluateCode);

// Analyze code execution
router.post('/analyze', authenticateToken, analyzeCodeController);

export default router;
