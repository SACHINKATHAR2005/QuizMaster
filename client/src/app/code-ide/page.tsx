'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CodeEditor from '@/components/CodeEditor';
import ProtectedRoute from '@/components/ProtectedRoute';

interface PracticeQuestion {
  questionId: string;
  questionText: string;
  codeSnippet?: string;
  language?: string;
  correctAnswer: string;
  userAnswer: string | null;
  questionIndex: number;
}

function CodeIDEContent() {
  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion | null>(null);
  const [allQuestions, setAllQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'practice' | 'practice-all'>('practice');
  const [darkMode, setDarkMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const getDefaultCode = (language: string) => {
    switch (language) {
      case 'python':
        return '# Write your solution here\nprint("Hello World")';
      case 'typescript':
        return '// Write your solution here\n// Output: Hello World';
      case 'react':
        return 'import React from "react";\n\nfunction MyComponent() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default MyComponent;';
      case 'javascript':
      default:
        return '// Write your solution here\n// Output: Hello World';
    }
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const defaultDarkMode = savedDarkMode !== null ? savedDarkMode === 'true' : true;
    setDarkMode(defaultDarkMode);
    if (savedDarkMode === null) {
      localStorage.setItem('darkMode', 'true');
    }

    const urlMode = searchParams.get('mode') as 'practice' | 'practice-all';
    setMode(urlMode || 'practice');

    if (urlMode === 'practice') {
      // Single question mode
      const questionData = localStorage.getItem('currentQuestion');
      if (questionData) {
        const question = JSON.parse(questionData);
        setCurrentQuestion(question);
        setUserCode(getDefaultCode(question.language || 'javascript'));
      }
    } else if (urlMode === 'practice-all') {
      // Multiple questions mode
      const questionsData = localStorage.getItem('practiceQuestions');
      const currentIdx = parseInt(localStorage.getItem('currentQuestionIndex') || '0');
      
      if (questionsData) {
        const questions = JSON.parse(questionsData);
        setAllQuestions(questions);
        setCurrentIndex(currentIdx);
        
        if (questions[currentIdx]) {
          setCurrentQuestion(questions[currentIdx]);
          setUserCode(getDefaultCode(questions[currentIdx].language || 'javascript'));
        }
      }
    }
  }, [searchParams]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const language = currentQuestion?.language || 'javascript';
      
      if (language === 'python') {
        // Python execution simulation
        if (userCode.includes('print(')) {
          const printMatches = userCode.match(/print\((.*?)\)/g);
          if (printMatches) {
            const outputs = printMatches.map(match => {
              const content = match.replace(/print\(|\)/g, '');
              try {
                return eval(content.replace(/"/g, '"').replace(/'/g, "'"));
              } catch {
                return content.replace(/['"]/g, '');
              }
            });
            setOutput(outputs.join('\n'));
          } else {
            setOutput('Code executed successfully!');
          }
        } else {
          setOutput('Code executed successfully! Add print() to see output.');
        }
      } else if (language === 'react') {
        // React component preview
        setShowPreview(true);
        setOutput('React component rendered in preview panel →');
      } else {
        // JavaScript/TypeScript execution
        if (userCode.includes('console.log')) {
          const logs: string[] = [];
          try {
            // Simple code execution without console.log capture
            eval(userCode);
            setOutput('Code executed successfully!');
          } catch (error) {
            setOutput(`Error: ${error}`);
          }
        } else {
          setOutput('Code executed successfully!');
        }
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleNextQuestion = () => {
    if (mode === 'practice-all' && currentIndex < allQuestions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentQuestion(allQuestions[nextIndex]);
      setUserCode(getDefaultCode(allQuestions[nextIndex].language || 'javascript'));
      setOutput('');
      localStorage.setItem('currentQuestionIndex', nextIndex.toString());
    }
  };

  const handlePreviousQuestion = () => {
    if (mode === 'practice-all' && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentQuestion(allQuestions[prevIndex]);
      setUserCode(getDefaultCode(allQuestions[prevIndex].language || 'javascript'));
      setOutput('');
      localStorage.setItem('currentQuestionIndex', prevIndex.toString());
    }
  };

  const handleBackToResults = () => {
    // Clean up localStorage
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('practiceQuestions');
    localStorage.removeItem('currentQuestionIndex');
    router.back();
  };

  if (!currentQuestion) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading question...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        {/* Navigation */}
        <nav className={`shadow-sm border-b transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
        }`}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  CodeMaster IDE
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
                <Button variant="outline" onClick={handleBackToResults}>
                  ← Back to Results
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Question Header */}
          <div className={`rounded-lg shadow-md p-6 mb-6 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">
                {mode === 'practice-all' 
                  ? `Question ${currentIndex + 1} of ${allQuestions.length}` 
                  : 'Practice Question'
                }
              </h1>
              
              {mode === 'practice-all' && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentIndex === 0}
                    className="px-4 py-2"
                  >
                    ← Previous
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={currentIndex >= allQuestions.length - 1}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2"
                  >
                    Next →
                  </Button>
                </div>
              )}
            </div>
            
            <h2 className="text-lg font-semibold mb-4">{currentQuestion.questionText}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Your Previous Answer:</span>
                <p className={`mt-1 p-2 rounded ${
                  darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                }`}>
                  {currentQuestion.userAnswer || 'No answer provided'}
                </p>
              </div>
              <div>
                <span className="font-medium">Correct Answer:</span>
                <p className={`mt-1 p-2 rounded ${
                  darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                }`}>
                  {currentQuestion.correctAnswer}
                </p>
              </div>
            </div>
          </div>

          {/* Code Editor and Output */}
          <div className={`grid gap-6 ${
            showPreview && currentQuestion?.language === 'react' 
              ? 'grid-cols-1 lg:grid-cols-3' 
              : 'grid-cols-1 lg:grid-cols-2'
          }`}>
            {/* Code Editor */}
            <div className={`rounded-lg shadow-md p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Code Editor
                </h3>
                <Button
                  onClick={runCode}
                  disabled={isRunning}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-4 py-2 flex items-center gap-2"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 18h6" />
                      </svg>
                      Run Code
                    </>
                  )}
                </Button>
              </div>
              
              <CodeEditor
                language={currentQuestion?.language || 'javascript'}
                defaultValue={userCode}
                height="400px"
                theme={darkMode ? 'vs-dark' : 'light'}
                onChange={(code) => setUserCode(code || '')}
              />
            </div>

            {/* Output */}
            <div className={`rounded-lg shadow-md p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Output
              </h3>
              
              <div className={`p-4 rounded-lg border min-h-[400px] font-mono text-sm ${
                darkMode 
                  ? 'bg-black border-gray-600 text-white [&_*]:text-white [&_*]:!text-white' 
                  : 'bg-white border-gray-300 text-black'
              }`}>
                <pre className={`whitespace-pre-wrap ${darkMode ? 'text-white' : 'text-black'}`}>{output || 'Click "Run Code" to see output...'}</pre>
              </div>
            </div>

            {/* React Preview Panel */}
            {showPreview && currentQuestion?.language === 'react' && (
              <div className={`rounded-lg shadow-md p-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  React Preview
                </h3>
                
                <div className={`p-4 rounded-lg border min-h-[400px] ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-center h-full">
                    <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div className="mb-4">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium mb-2">React Component Preview</p>
                      <p className="text-sm">Your React component would render here</p>
                      <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                          Component: MyComponent
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function CodeIDEPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </ProtectedRoute>
    }>
      <CodeIDEContent />
    </Suspense>
  );
}
