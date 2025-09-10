import { Request, Response } from "express";
import File from '../models/file.model.js';

interface SaveFileRequest {
    fileName: string;
    language: string;
    code: string;
}

export const saveFile = async (req: Request<{}, {}, SaveFileRequest>, res: Response): Promise<Response> => {
    try {
        const { fileName, language, code } = req.body;
        const userId = req.user?.id;

        if (!fileName || !language || !code) {
            return res.status(400).json({
                message: "File name, language, and code are required!",
                success: false
            });
        }

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated!",
                success: false
            });
        }

        // Check if file already exists for this user
        const existingFile = await File.findOne({ userId, fileName });

        if (existingFile) {
            // Update existing file
            existingFile.code = code;
            existingFile.language = language;
            existingFile.updatedAt = new Date();
            await existingFile.save();

            return res.status(200).json({
                message: "File updated successfully!",
                success: true,
                data: existingFile
            });
        } else {
            // Create new file
            const newFile = new File({
                userId,
                fileName,
                language,
                code
            });

            await newFile.save();

            return res.status(201).json({
                message: "File saved successfully!",
                success: true,
                data: newFile
            });
        }

    } catch (error) {
        console.error('Save file error:', error);
        return res.status(500).json({
            message: "Failed to save file",
            success: false,
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const loadFile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { fileName } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated!",
                success: false
            });
        }

        const file = await File.findOne({ userId, fileName });

        if (!file) {
            return res.status(404).json({
                message: "File not found!",
                success: false
            });
        }

        return res.status(200).json({
            message: "File loaded successfully!",
            success: true,
            data: file
        });

    } catch (error) {
        console.error('Load file error:', error);
        return res.status(500).json({
            message: "Failed to load file",
            success: false,
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getUserFiles = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated!",
                success: false
            });
        }

        const files = await File.find({ userId }).sort({ updatedAt: -1 });

        return res.status(200).json({
            message: "Files retrieved successfully!",
            success: true,
            data: files
        });

    } catch (error) {
        console.error('Get user files error:', error);
        return res.status(500).json({
            message: "Failed to retrieve files",
            success: false,
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const deleteFile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { fileName } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated!",
                success: false
            });
        }

        const deletedFile = await File.findOneAndDelete({ userId, fileName });

        if (!deletedFile) {
            return res.status(404).json({
                message: "File not found!",
                success: false
            });
        }

        return res.status(200).json({
            message: "File deleted successfully!",
            success: true
        });

    } catch (error) {
        console.error('Delete file error:', error);
        return res.status(500).json({
            message: "Failed to delete file",
            success: false,
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
