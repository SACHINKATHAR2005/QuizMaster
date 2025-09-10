import { Request, Response } from 'express';
import Challenge from '../models/challenge.model.js';
import { generateChallenge, evaluateUserCode } from '../service/challengeGeneration.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    username?: string;
  };
}

interface GetChallengesQuery {
  technology?: string;
  difficulty?: string;
  page?: string;
  limit?: string;
}

interface CreateChallengeRequest {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  technology: string;
  starterCode: string;
  solution: string;
  hints: string[];
  testCases?: any[];
  apiEndpoint?: string;
  tags?: string[];
}

export const getChallenges = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { technology, difficulty } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const filter: any = { userId }; // Only get challenges for current user
    if (technology) filter.technology = technology;
    if (difficulty) filter.difficulty = difficulty;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const challenges = await Challenge.find(filter)
      .select('-solution') // Don't send solution by default
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Challenge.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: challenges,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const getChallenge = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const challenge = await Challenge.findOne({ _id: id, userId }); // Only get user's own challenge
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: challenge
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch challenge',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const createChallenge = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const challengeData = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const challenge = new Challenge({ ...challengeData, userId });
    await challenge.save();

    return res.status(201).json({
      success: true,
      data: challenge,
      message: 'Challenge created successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create challenge',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Generate AI challenges using existing Groq setup
export const generateAIChallenge = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { technology, difficulty, topic } = req.body;
    const userId = req.user?.id;
    
    if (!technology || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Technology and difficulty are required'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Import and use the challenge generation service
    const { generateChallenge } = await import('../service/challengeGeneration.js');
    const challengeData = await generateChallenge(technology, difficulty, topic);

    const challenge = new Challenge({ ...challengeData, userId });
    await challenge.save();

    return res.status(201).json({
      success: true,
      data: challenge,
      message: 'AI challenge generated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate AI challenge',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

const getStarterCode = (technology: string): string => {
  const starterCodes = {
    react: `function App() {
  // Your component here
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  );
}`,
    javascript: `// Write your JavaScript code here
function solution() {
  // Your code here
  return "Hello World!";
}

console.log(solution());`,
    python: `# Write your Python code here
def solution():
    # Your code here
    return "Hello World!"

print(solution())`,
    html: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <!-- Your HTML here -->
  <h1>Hello World!</h1>
</body>
</html>`,
    css: `/* Write your CSS here */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
}

h1 {
  color: #333;
  text-align: center;
}`
  };
  
  return starterCodes[technology as keyof typeof starterCodes] || starterCodes.javascript;
};

const getSampleSolution = (technology: string): string => {
  // Return appropriate solution based on technology
  return getStarterCode(technology);
};

export const explainAnswer = async (req: Request<{}, {}, { question: string; userAnswer: string; correctAnswer: string; topic: string }>, res: Response): Promise<Response> => {
  try {
    const { question, userAnswer, correctAnswer, topic } = req.body;

    if (!question || !userAnswer || !correctAnswer || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: question, userAnswer, correctAnswer, topic'
      });
    }

    // Create a simple explanation for now since explainQuizAnswer is not available
    const explanation = `The correct answer is "${correctAnswer}". ${topic ? `This relates to ${topic}.` : ''}`;

    return res.status(200).json({
      success: true,
      data: { explanation }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate explanation'
    });
  }
};

export const evaluateCode = async (req: Request<{}, {}, { 
  userCode: string; 
  challenge: any; 
  language?: string;
  submissionData?: {
    timeSpent: number;
    challengeStartTime: number;
    submissionTime: number;
    keystrokes?: number;
    pasteEvents?: number;
    codeChangeEvents?: number;
  }
}>, res: Response): Promise<Response> => {
  try {
    const { userCode, challenge, language, submissionData } = req.body;
    
    if (!userCode || !challenge) {
      return res.status(400).json({
        success: false,
        message: 'Code and challenge data are required'
      });
    }

    // Call the enhanced evaluation function with timing data
    const evaluation = await evaluateUserCode(userCode, challenge, submissionData);

    return res.status(200).json({
      success: true,
      data: evaluation,
      message: 'Code evaluated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to evaluate code',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
