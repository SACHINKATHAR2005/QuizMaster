import { Request, Response } from "express";
import { generateQuiz } from "../service/quizGenratetion.js";
import quizModel from '../models/quiz.model.js'


interface quizData {
    topic: string,
    difficulty: string,
    includeCodeQuestions?: boolean
}

export const makeQuiz = async (req: Request<{ id: string }, {}, quizData>, res: Response): Promise<Response> => {
    try {
        const { topic, difficulty, includeCodeQuestions } = req.body;
        const userId = req.user?.id;

        if (!topic || !difficulty) {
            return res.status(400).json({
                message: "topic,level requied to generate the quiz !",
                success: false
            })
        }
        if (!userId) {
            return res.status(400).json({
                message: "user does not exists plz login again !",
                success: false
            })
        }


        try {
            const Quiz = await generateQuiz(topic, difficulty, includeCodeQuestions);

            const newQuiz = new quizModel({
                userId,
                topic,
                difficulty,
                questions: Quiz,
                generatedAt: new Date()
            })

            await newQuiz.save();

            return res.status(200).json({
                message: "quiz generated successfully !",
                success: true,
                data: newQuiz
            })

        } catch (quizGenerationError) {
            
            // Check if it's an AI service error
            if (quizGenerationError instanceof Error && quizGenerationError.message.includes('AI')) {
                return res.status(500).json({
                    message: "AI service is currently unavailable. Please try again later.",
                    success: false,
                    error: "AI quiz generation failed"
                })
            }
            
            // For other errors, return generic message
            return res.status(500).json({
                message: "Failed to generate quiz. Please try again.",
                success: false,
                error: quizGenerationError instanceof Error ? quizGenerationError.message : "Unknown error"
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: "server side error",
            success: false,
            error: (error instanceof Error ? error.message : String(error))
        })
    }
}


export const submitQuiz = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { quizId, userAnswers } = req.body;
        const userId = req.user?.id;

        if (!quizId || !userAnswers) {
            return res.status(400).json({
                message: "Quiz ID and user answers are required!",
                success: false
            })
        }

        if (!userId) {
            return res.status(400).json({
                message: "User not exists!",
                success: false
            })
        }

        // Find the existing quiz
        const existingQuiz = await quizModel.findOne({ 
            _id: quizId, 
            userId: userId 
        });

        if (!existingQuiz) {
            return res.status(404).json({
                message: "Quiz not found!",
                success: false
            })
        }

        // Check if already submitted
        if (existingQuiz.userAnswers && existingQuiz.userAnswers.length > 0) {
            return res.status(400).json({
                message: "Quiz already submitted!",
                success: false
            })
        }

        // Calculate score
        let score = 0;
        for (let i = 0; i < existingQuiz.questions.length; i++) {
            if (userAnswers[i] === existingQuiz.questions[i].correctAnswer) {
                score++;
            }
        }

        // Update the existing quiz with answers and score
        existingQuiz.userAnswers = userAnswers;
        existingQuiz.score = score;
        await existingQuiz.save();


        return res.status(200).json({
            message: "Quiz submitted successfully!",
            success: true,
            data: existingQuiz
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: (error instanceof Error ? error.message : String(error))
        })
    }
}


export const quizScore = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params; // quizId

    // Find quiz by _id and userId
    const quiz = await quizModel.findOne({ _id: id, userId });
    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
        success: false,
      });
    }

    const results = quiz.questions.map((q, index) => {
      const userAnswer = quiz.userAnswers?.[index] || null;

      return {
        questionId: q.questionId,
        questionText: q.questionText,
        codeSnippet: q.codeSnippet,
        correctAnswer: q.correctAnswer,
        userAnswer,
        isCorrect: userAnswer === q.correctAnswer,
      };
    });

    return res.status(200).json({
      message: "Quiz result fetched successfully",
      success: true,
      score: quiz.score,
      total: quiz.questions.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server side error",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getQuizById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({
                message: "User not exists!",
                success: false
            })
        }

        const quiz = await quizModel.findOne({ _id: id, userId: userId });

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found!",
                success: false
            })
        }

        return res.status(200).json({
            message: "Quiz retrieved successfully!",
            success: true,
            data: quiz
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: (error instanceof Error ? error.message : String(error))
        })
    }
}

export const getAllQuizData = async(req:Request,res:Response):Promise<Response>=>{
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(400).json({
                message: "User not authenticated!",
                success: false
            })
        }

        // Only get quizzes for the current user
        const userData = await quizModel.find({ userId: userId }).sort({ generatedAt: -1 });
        
        
        return res.status(200).json({
            message: "User quiz history retrieved successfully",
            success: true,
            data: userData
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Server side error",
            error: (error instanceof Error ? error.message : String(error)),
            success: false
        });
    }
}