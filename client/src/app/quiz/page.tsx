'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore, useQuizStore } from '@/lib/store';
import { quizAPI } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import CodeEditor from '@/components/CodeEditor';

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [codeAnswers, setCodeAnswers] = useState<{[key: number]: string}>({});
  const [showAiHelp, setShowAiHelp] = useState(false);
  const [loadingAiHelp, setLoadingAiHelp] = useState(false);
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { currentQuiz, clearCurrentQuiz } = useQuizStore();

  useEffect(() => {
    if (currentQuiz) {
      // Initialize userAnswers array with empty strings
      setUserAnswers(new Array(currentQuiz.questions.length).fill(''));
    }
    const savedDarkMode = localStorage.getItem('darkMode');
    const defaultDarkMode = savedDarkMode !== null ? savedDarkMode === 'true' : true;
    setDarkMode(defaultDarkMode);
    if (savedDarkMode === null) {
      localStorage.setItem('darkMode', 'true');
    }
  }, [currentQuiz]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const handleGetAIHelp = async () => {
    if (currentQuestion && userAnswers[currentQuestionIndex] !== undefined) {
      const userAnswer = (currentQuestion as any).type === 'multiple-choice' 
        ? currentQuestion.options[userAnswers[currentQuestionIndex] as any]
        : userAnswers[currentQuestionIndex];
      
      try {
        setLoadingAiHelp(true);
        
        const response = await fetch('/api/challenges/explain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            question: currentQuestion.questionText,
            userAnswer: userAnswer,
            correctAnswer: currentQuestion.correctAnswer,
            topic: (currentQuestion as any).topic || 'Programming'
          })
        });

        const data = await response.json();
        
        if (data.success) {
          setAiExplanation(data.data.explanation);
          setShowAiHelp(true);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Failed to get AI explanation:', error);
        // Fallback explanation
        const fallbackExplanation = `🤖 **AI Explanation**

The correct answer is "${currentQuestion.correctAnswer}".

Your answer "${userAnswer}" shows good thinking! Here are some tips:

💡 **Key Concept**: ${(currentQuestion as any).topic || 'Programming fundamentals'}
- Review the fundamental concepts related to this topic
- Practice similar questions to strengthen understanding
- Consider different approaches to the problem

🎯 **Keep Learning**: Every mistake is a learning opportunity! 🚀`;

        setAiExplanation(fallbackExplanation);
        setShowAiHelp(true);
      } finally {
        setLoadingAiHelp(false);
      }
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (userAnswers.some(answer => !answer)) {
      setError('Please answer all questions before submitting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await quizAPI.submit({
        quizId: currentQuiz!._id,
        userAnswers: userAnswers,
      });

      if (response.data.success) {
        console.log('Quiz submitted successfully:', response.data.data);
        clearCurrentQuiz();
        router.push(`/result/${currentQuiz!._id}`);
      }
    } catch (err: any) {
      console.error('Quiz submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    clearCurrentQuiz();
    router.push('/dashboard');
  };

  if (!currentQuiz) {
    return (
      <ProtectedRoute>
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
            : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
        }`}>
          <div className="text-center">
            <div className={`px-6 py-4 rounded-md mb-4 ${
              darkMode 
                ? 'bg-yellow-900 border border-yellow-700 text-yellow-200'
                : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
            }`}>
              No quiz found. Please generate a quiz first.
            </div>
            <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  const answeredQuestions = userAnswers.filter(answer => answer).length;
  const isCodeQuestion = (currentQuestion as any).type === 'code';

  return (
    <ProtectedRoute>
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
      }`}>
        {/* Navigation */}
        <nav className={`shadow-sm border-b transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CodeMaster
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {darkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Quiz: {currentQuiz.topic}
                </span>
                <Button variant="outline" onClick={handleBackToDashboard}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Progress Bar */}
          <div className={`rounded-2xl shadow-lg p-6 mb-6 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                {isCodeQuestion && (
                  <span className="ml-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Code
                  </span>
                )}
              </h2>
              <span className="text-sm opacity-70">
                {answeredQuestions}/{currentQuiz.questions.length} answered
              </span>
            </div>
            <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className={`rounded-2xl shadow-lg p-8 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            {error && (
              <div className={`border px-4 py-3 rounded-xl text-sm mb-6 ${
                darkMode 
                  ? 'bg-red-900 border-red-700 text-red-200'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {error}
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6">
                {currentQuestion.questionText}
              </h3>
              
              {/* Code Snippet Display */}
              {currentQuestion.codeSnippet && (
                <div className={`p-4 rounded-xl mb-6 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-300'
                }`}>
                  <pre className="text-sm overflow-x-auto">
                    <code>{currentQuestion.codeSnippet}</code>
                  </pre>
                </div>
              )}
              
              {/* Code Question */}
              {isCodeQuestion ? (
                <div className="space-y-6">
                  <div className={`p-4 rounded-xl ${
                    darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <p className="text-sm opacity-70 mb-2">Write your code solution:</p>
                    <CodeEditor
                      language={(currentQuestion as any).language || 'javascript'}
                      defaultValue={codeAnswers[currentQuestionIndex] || (currentQuestion as any).starterCode || '// Write your solution here'}
                      height="300px"
                      onChange={(code) => {
                        const newCodeAnswers = { ...codeAnswers };
                        newCodeAnswers[currentQuestionIndex] = code || '';
                        setCodeAnswers(newCodeAnswers);
                        handleAnswerSelect(code || '');
                      }}
                    />
                  </div>
                  {(currentQuestion as any).expectedOutput && (
                    <div className={`p-4 rounded-xl ${
                      darkMode ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <p className="text-sm font-medium mb-2">Expected Output:</p>
                      <pre className="text-sm opacity-80">{(currentQuestion as any).expectedOutput}</pre>
                    </div>
                  )}
                </div>
              ) : (
                /* Regular Multiple Choice */
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                        userAnswers[currentQuestionIndex] === option
                          ? darkMode
                            ? 'border-blue-500 bg-blue-900 text-blue-200'
                            : 'border-blue-600 bg-blue-50 text-blue-900'
                          : darkMode
                            ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-bold text-lg mr-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {String.fromCharCode(65 + index)}.
                      </span> 
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* AI Help Modal */}
              {showAiHelp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className={`max-w-2xl w-full rounded-2xl shadow-xl ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                  }`}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-xl flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          AI Explanation
                        </h4>
                        <button
                          onClick={() => setShowAiHelp(false)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="whitespace-pre-line mb-6 text-sm leading-relaxed">
                        {loadingAiHelp ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Getting AI explanation...</span>
                          </div>
                        ) : (
                          aiExplanation
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => router.push('/code-editor')}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          Practice in Code Editor
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAiHelp(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3"
              >
                ← Previous
              </Button>

              <div className="flex space-x-3">

                {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!userAnswers[currentQuestionIndex]}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3"
                  >
                    Next Question →
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={loading || userAnswers.some(answer => !answer)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-3"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Submit Quiz
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Question Navigation */}
          <div className={`rounded-2xl shadow-lg p-6 mt-6 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <h3 className="text-lg font-semibold mb-4">Question Navigation</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {currentQuiz.questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    index === currentQuestionIndex
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                      : userAnswers[index]
                      ? darkMode
                        ? 'bg-green-800 text-green-200 border border-green-600'
                        : 'bg-green-100 text-green-800 border border-green-200'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                  {(question as any).type === 'code' && (
                    <svg className="absolute -top-1 -right-1 w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
