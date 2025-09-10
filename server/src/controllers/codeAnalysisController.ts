import { Request, Response } from 'express';
import { analyzeCode } from '../service/codeAnalysis.js';

export const analyzeCodeController = async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required'
      });
    }

    const analysis = await analyzeCode(code, language);

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze code'
    });
  }
};
