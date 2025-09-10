import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { saveFile, loadFile, getUserFiles, deleteFile } from '../controllers/file.controller.js';

const router = express.Router();

// Save file
router.post("/save", authenticateToken, saveFile);

// Load specific file
router.get("/load/:fileName", authenticateToken, loadFile);

// Get all user files
router.get("/list", authenticateToken, getUserFiles);

// Delete file
router.delete("/delete/:fileName", authenticateToken, deleteFile);

export default router;
