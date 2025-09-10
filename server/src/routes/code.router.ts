import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { executeCode } from '../controllers/code.controller.js';

const router = express.Router();

// Execute code endpoint
router.post("/execute", authenticateToken, executeCode);

export default router;
