import { Request, Response } from "express";
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

interface CodeExecutionRequest {
    code: string;
    language: string;
}

export const executeCode = async (req: Request<{}, {}, CodeExecutionRequest>, res: Response): Promise<Response> => {
    try {
        const { code, language } = req.body;
        const userId = req.user?.id;

        if (!code || !language) {
            return res.status(400).json({
                message: "Code and language are required!",
                success: false
            });
        }

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated!",
                success: false
            });
        }

        // Support JavaScript and Python
        if (!['javascript', 'python'].includes(language)) {
            return res.status(400).json({
                message: "Only JavaScript and Python are supported currently",
                success: false
            });
        }

        // Create a temporary file
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const fileExtension = language === 'python' ? 'py' : 'js';
        const fileName = `code_${userId}_${Date.now()}.${fileExtension}`;
        const filePath = path.join(tempDir, fileName);

        // Write code to temp file
        fs.writeFileSync(filePath, code);

        // Determine execution command
        const execCommand = language === 'python' ? `python "${filePath}"` : `node "${filePath}"`;

        // Execute the code with timeout
        const execPromise = new Promise<string>((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Code execution timeout (5 seconds)'));
            }, 5000);

            exec(execCommand, (error, stdout, stderr) => {
                clearTimeout(timeout);
                
                // Clean up temp file
                try {
                    fs.unlinkSync(filePath);
                } catch (cleanupError) {
                    console.warn('Failed to cleanup temp file:', cleanupError);
                }

                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve(stdout);
                }
            });
        });

        const output = await execPromise;

        return res.status(200).json({
            message: "Code executed successfully",
            success: true,
            output: output || "No output",
            language
        });

    } catch (error) {
        console.error('Code execution error:', error);
        return res.status(500).json({
            message: "Code execution failed",
            success: false,
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
