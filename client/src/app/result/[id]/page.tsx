'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import { quizAPI } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

interface QuizResult {
  score: number;
  total: number;
  results: Array<{
    questionId: string;
    questionText: string;
    codeSnippet?: string;
    language?: string;
    correctAnswer: string;
    userAnswer: string | null;
    isCorrect: boolean;
  }>;
}

export default function ResultPage() {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();

  useEffect(() => {
    if (params.id) {
      loadQuizResult(params.id as string);
    }
  }, [params.id]);

  const loadQuizResult = async (quizId: string) => {
    try {
      const response = await quizAPI.getResult(quizId);
      if (response.data.success) {
        setResult(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load quiz result');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleTakeNewQuiz = () => {
    router.push('/dashboard');
  };

  const handleTryQuestion = (questionData: any, index: number) => {
    // Store the question data in localStorage for the code IDE
    const questionForIDE = {
      questionId: questionData.questionId,
      questionText: questionData.questionText,
      codeSnippet: questionData.codeSnippet,
      language: questionData.language || 'javascript',
      correctAnswer: questionData.correctAnswer,
      userAnswer: questionData.userAnswer,
      questionIndex: index
    };
    localStorage.setItem('currentQuestion', JSON.stringify(questionForIDE));
    router.push('/code-ide?mode=practice');
  };

  const handleTryAllWrongQuestions = () => {
    const wrongQuestions = result?.results.filter(item => !item.isCorrect) || [];
    const questionsForIDE = wrongQuestions.map((item, index) => ({
      questionId: item.questionId,
      questionText: item.questionText,
      codeSnippet: item.codeSnippet,
      language: item.language || 'javascript',
      correctAnswer: item.correctAnswer,
      userAnswer: item.userAnswer,
      questionIndex: index
    }));
    localStorage.setItem('practiceQuestions', JSON.stringify(questionsForIDE));
    localStorage.setItem('currentQuestionIndex', '0');
    router.push('/code-ide?mode=practice-all');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your results...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md mb-4">
              {error}
            </div>
            <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!result) {
    return null;
  }

  const percentage = Math.round((result.score / result.total) * 100);
  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'Excellent! Outstanding performance!';
    if (percentage >= 80) return 'Great job! Well done!';
    if (percentage >= 70) return 'Good work! Keep it up!';
    if (percentage >= 60) return 'Not bad! Room for improvement.';
    if (percentage >= 50) return 'Keep practicing! You can do better.';
    return 'Don\'t give up! Review and try again.';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold text-gray-900">QuizMaster</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Quiz Results</span>
                <Button variant="outline" onClick={handleBackToDashboard}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Score Summary */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Complete!</h1>
            
            <div className="mb-6">
              <div className={`text-6xl font-bold ${getScoreColor(result.score, result.total)} mb-2`}>
                {result.score}/{result.total}
              </div>
              <div className="text-2xl font-semibold text-gray-700 mb-2">
                {percentage}%
              </div>
              <div className="text-lg text-gray-600">
                {getScoreMessage(result.score, result.total)}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleTakeNewQuiz}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Take Another Quiz
              </Button>
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Results</h2>
            
            <div className="space-y-6">
              {result.results.map((item, index) => (
                <div
                  key={index}
                  className={`border-l-4 p-4 rounded-r-lg ${
                    item.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      item.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {item.isCorrect ? '✓' : '✗'}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Question {index + 1}: {item.questionText}
                      </h3>
                      
                      {/* Code Snippet Display */}
                      {item.codeSnippet && (
                        <div className="mb-4 p-3 bg-gray-100 rounded-lg border">
                          <p className="text-sm font-medium text-gray-700 mb-2">Code:</p>
                          <pre className="text-sm overflow-x-auto">
                            <code>{item.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Your Answer:</span>
                          <p className={`mt-1 p-2 rounded ${
                            item.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.userAnswer || 'No answer provided'}
                          </p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Correct Answer:</span>
                          <p className="mt-1 p-2 rounded bg-green-100 text-green-800">
                            {item.correctAnswer}
                          </p>
                        </div>
                      </div>
                      
                      {/* Try This Answer Button for Wrong Questions */}
                      {!item.isCorrect && item.codeSnippet && (
                        <div className="mt-4">
                          <Button
                            onClick={() => handleTryQuestion(item, index)}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 text-sm flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Check Ans
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Try All Wrong Questions Button */}
            {result.results.some(item => !item.isCorrect && item.codeSnippet) && (
              <div className="mt-8 text-center">
                <Button
                  onClick={handleTryAllWrongQuestions}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg flex items-center gap-3 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                  </svg>
                  Try All Wrong Questions ({result.results.filter(item => !item.isCorrect && item.codeSnippet).length})
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
