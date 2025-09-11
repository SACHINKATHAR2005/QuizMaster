// Challenge utility functions
export interface Challenge {
  id: string;
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

export interface FilterState {
  technology: string;
  difficulty: string;
}

export interface FeedbackData {
  score: number;
  feedback: string;
  suggestions: string[];
  authenticity?: {
    isLikelyAIGenerated: boolean;
    confidence: number;
    indicators: string[];
    suspiciousPatterns: string[];
  };
  warning?: string;
}

// Constants
export const TECHNOLOGIES = ['all', 'react', 'javascript', 'typescript', 'python', 'html', 'css'];
export const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];

// Utility functions
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800 border-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'hard': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getTechnologyIcon = (technology: string): string => {
  const icons: Record<string, string> = {
    react: '⚛️',
    javascript: '🟨',
    typescript: '🔷',
    python: '🐍',
    html: '🌐',
    css: '🎨'
  };
  return icons[technology] || '💻';
};

// Code evaluation utility
export const evaluateUserCode = (code: string, challenge: Challenge | null) => {
  if (!challenge || !code.trim()) {
    return { percentage: 0, feedback: "No code provided", suggestions: ["Write some code to get started"] };
  }

  let percentage = 0;
  const suggestions: string[] = [];
  let feedback = "";

  // Basic code analysis
  const codeLength = code.trim().length;
  const hasFunction = /function|const.*=|class/.test(code);
  const hasReturn = /return/.test(code);
  const hasComments = /\/\/|\/\*/.test(code);

  // Scoring logic
  if (codeLength > 50) percentage += 20;
  if (hasFunction) percentage += 30;
  if (hasReturn) percentage += 25;
  if (hasComments) percentage += 15;
  if (code.includes(challenge.technology)) percentage += 10;

  // Generate feedback based on score
  if (percentage >= 80) {
    feedback = "🎉 Excellent work! Your code looks comprehensive and well-structured.";
    suggestions.push("Consider adding error handling for edge cases");
    suggestions.push("Great job following best practices!");
  } else if (percentage >= 60) {
    feedback = "👍 Good progress! Your code is on the right track with room for improvement.";
    suggestions.push("Add more functionality to complete the challenge");
    suggestions.push("Consider adding comments to explain your logic");
  } else if (percentage >= 40) {
    feedback = "📝 You're making progress! Keep building on your current implementation.";
    suggestions.push("Add the missing core functionality");
    suggestions.push("Review the challenge requirements carefully");
  } else {
    feedback = "🔄 Your code needs significant work to meet the challenge requirements.";
    suggestions.push("Review the hints provided for guidance");
    suggestions.push("Start with the basic structure and build incrementally");
  }

  return { percentage, feedback, suggestions };
};

// Theme utilities
export const getThemeClasses = (darkMode: boolean) => ({
  nav: darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
  sidebar: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200',
  button: darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700',
  card: darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50',
  text: darkMode ? 'text-gray-100' : 'text-gray-900',
  textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600'
});
