'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Editor } from '@monaco-editor/react';
import ReactPreview from '../../components/ReactPreview';
import DelayedPreview from '../../components/DelayedPreview';
import ChallengeNavbar from '../../components/ChallengeNavbar';
import ChallengeButtons from '../../components/ChallengeButtons';
import ResizableTerminal from '../../components/ResizableTerminal';
import { challengeAPI } from '../../lib/api';
import { 
  Challenge, 
  FilterState, 
  FeedbackData,
  TECHNOLOGIES, 
  DIFFICULTIES, 
  getDifficultyColor, 
  getTechnologyIcon, 
  evaluateUserCode, 
  getThemeClasses 
} from '../../utils/challengeUtils';

// Additional types for feedback
interface AuthenticityData {
  isLikelyAIGenerated: boolean;
  confidence: number;
  indicators: string[];
  suspiciousPatterns: string[];
}

// Mock data
const MOCK_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Interactive Alert Button',
    description: 'Create a button component that displays an alert popup when clicked.',
    difficulty: 'easy',
    technology: 'react',
    starterCode: `function AlertButton() {
  return (
    <button>
      Click me
    </button>
  );
}`,
    solution: `function AlertButton() {
  const handleClick = () => {
    alert('Button clicked!');
  };
  
  return (
    <button onClick={handleClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
      Click me
    </button>
  );
}`,
    hints: [
      'Create a function called handleClick that uses alert()',
      'Add onClick={handleClick} to the button element',
      'Style the button with padding and fontSize'
    ],
    tags: ['react', 'events', 'components']
  },
  {
    id: '2',
    title: 'Fetch Cat Facts API',
    description: 'Build a JavaScript app that fetches and displays random cat facts.',
    difficulty: 'medium',
    technology: 'javascript',
    starterCode: `async function displayCatFact() {
  // Your code here
}

displayCatFact();`,
    solution: `async function displayCatFact() {
  try {
    const response = await fetch('https://catfact.ninja/fact');
    const data = await response.json();
    // Cat fact retrieved successfully
  } catch (error) {
    console.error('Error:', error);
  }
}

displayCatFact();`,
    hints: [
      'Use fetch() to make HTTP requests',
      'The API returns JSON with a "fact" property',
      'Use async/await for handling promises',
      'Add error handling with try/catch'
    ],
    tags: ['javascript', 'api', 'fetch', 'async'],
    apiEndpoint: 'https://catfact.ninja/fact'
  }
];

// Utility functions
const getDifficultyClasses = (difficulty: string, darkMode: boolean): string => {
  const baseClasses = 'text-xs px-2 py-1 rounded';
  const colorMap = {
    easy: darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800',
    medium: darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
    hard: darkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800',
    default: darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
  };
  return `${baseClasses} ${colorMap[difficulty as keyof typeof colorMap] || colorMap.default}`;
};



export default function ChallengesPage() {
  // State
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedTechnology, setSelectedTechnology] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [hintSolutionState, setHintSolutionState] = useState<'none' | 'hints' | 'solution'>('none');
  const [showPreview, setShowPreview] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [filters, setFilters] = useState({
    technology: 'all',
    difficulty: 'all'
  });
  const [feedback, setFeedback] = useState<{
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
  } | null>(null);

  // Timing and authenticity tracking
  const [challengeStartTime, setChallengeStartTime] = useState<number>(0);
  const [keystrokes, setKeystrokes] = useState<number>(0);
  const [pasteEvents, setPasteEvents] = useState<number>(0);
  const [codeChangeEvents, setCodeChangeEvents] = useState<number>(0);

  // Load challenges
  const loadChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const response = await challengeAPI.getChallenges({
        technology: filters.technology === 'all' ? undefined : filters.technology,
        difficulty: filters.difficulty === 'all' ? undefined : filters.difficulty
      });
      setChallenges(response.data.data || []);
    } catch (error) {
      console.error('Error loading challenges:', error);
      setChallenges([]);
      setTerminalOutput('❌ Failed to load challenges from server.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Handle challenge selection
  const handleChallengeSelect = useCallback((challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCode(challenge.starterCode);
    setOutput('');
    setHintSolutionState('none');
    setFeedback(null);
    setTerminalOutput('');
    
    // Start timing tracking for authenticity analysis
    setChallengeStartTime(Date.now());
    setKeystrokes(0);
    setPasteEvents(0);
    setCodeChangeEvents(0);
  }, []);

  // Generate AI Challenge
  const generateAIChallenge = useCallback(async () => {
    try {
      setLoading(true);
      const response = await challengeAPI.generateAI({
        technology: filters.technology === 'all' ? 'javascript' : filters.technology,
        difficulty: filters.difficulty === 'all' ? 'medium' : filters.difficulty,
        topic: 'general programming'
      });
      
      if (response.data.success) {
        const newChallenge = response.data.data;
        setChallenges(prev => [newChallenge, ...prev]);
        handleChallengeSelect(newChallenge);
      }
    } catch (error) {
      console.error('Error generating AI challenge:', error);
      setTerminalOutput(' Failed to generate AI challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, handleChallengeSelect]);

  // Execute code with AI analysis
  const executeCode = useCallback(async () => {
    if (!selectedChallenge || !code.trim()) return;
    
    setIsExecuting(true);
    setShowTerminal(true);
    setTerminalOutput('Analyzing code execution...\n');
    
    try {
      const response = await fetch('/api/challenges/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          code,
          language: selectedChallenge.technology
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setTerminalOutput(data.analysis);
      } else {
        setTerminalOutput(`❌ Analysis failed: ${data.error}`);
      }
    } catch (error) {
      setTerminalOutput(`❌ Error:\n${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsExecuting(false);
    }
  }, [selectedChallenge, code]);

  // Evaluate code with AI
  const evaluateCode = useCallback(async () => {
    if (!selectedChallenge || !code.trim()) {
      setTerminalOutput('❌ Please write some code first!');
      return;
    }

    // Check if code is only comments or starter code
    const codeLines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'));
    const hasActualCode = codeLines.some(line => 
      !line.includes('TODO') && 
      !line.includes('Your creative solution here') &&
      !line.includes('Complete implementation') &&
      line.trim() !== '{' && 
      line.trim() !== '}' &&
      !line.includes('function') || line.includes('return')
    );

    if (!hasActualCode) {
      setTerminalOutput('❌ Please write actual implementation code, not just comments or starter code!');
      return;
    }

    setIsExecuting(true);
    
    try {
      // Calculate timing and behavioral data
      const submissionData = {
        timeSpent: challengeStartTime ? (Date.now() - challengeStartTime) / 1000 : 0,
        keystrokes,
        pasteEvents,
        codeChangeEvents
      };

      // Try AI evaluation first
      try {
        const response = await fetch('/api/challenges/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            challenge: selectedChallenge,
            timeSpent: submissionData.timeSpent,
            keystrokes: submissionData.keystrokes,
            pasteEvents: submissionData.pasteEvents,
            codeChangeEvents: submissionData.codeChangeEvents
          })
        });

        if (response.ok) {
          const evaluation = await response.json();
          setFeedback(evaluation.data);
          setTerminalOutput(`✅ Code evaluation completed!\n\nScore: ${evaluation.data.score}%\n${evaluation.data.feedback}\n\nSuggestions:\n${evaluation.data.suggestions.map((s: string) => `• ${s}`).join('\n')}`);
        } else {
          throw new Error('API evaluation failed');
        }
      } catch (apiError) {
        // API evaluation failed, using fallback
        
        // Fallback to local evaluation with basic authenticity check
        const evaluation = evaluateUserCode(code, selectedChallenge);
        const basicAuthenticityCheck = {
          isLikelyAIGenerated: submissionData.timeSpent < 30,
          confidence: submissionData.timeSpent < 30 ? 80 : 20,
          indicators: submissionData.timeSpent < 30 ? ['Extremely fast submission'] : [],
          suspiciousPatterns: submissionData.timeSpent < 30 ? ['Submitted too quickly'] : []
        };
        
        const feedbackData = {
          score: evaluation.percentage,
          feedback: evaluation.feedback,
          suggestions: evaluation.suggestions,
          authenticity: basicAuthenticityCheck,
          warning: basicAuthenticityCheck.isLikelyAIGenerated ? 
            "⚠️ This code shows patterns typical of AI-generated solutions. Please ensure you're writing original code." : undefined
        };
        
        setFeedback(feedbackData);
        setTerminalOutput(`✅ Code evaluation completed!\n\nScore: ${evaluation.percentage}%\n${evaluation.feedback}\n\nSuggestions:\n${evaluation.suggestions.map(s => `• ${s}`).join('\n')}${feedbackData.warning ? `\n\n${feedbackData.warning}` : ''}`);
      }
      
    } catch (error) {
      console.error('Code evaluation failed:', error);
      const errorFeedback = {
        score: 0,
        feedback: 'Code evaluation failed. Please check your code syntax.',
        suggestions: ['Check for syntax errors', 'Ensure all brackets are closed', 'Review the challenge requirements']
      };
      setFeedback(errorFeedback);
      setTerminalOutput(` Evaluation error:\n${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsExecuting(false);
    }
  }, [selectedChallenge, code, challengeStartTime, keystrokes, pasteEvents, codeChangeEvents]);

  // Initial load
  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  // Load challenges when filters change
  useEffect(() => {
    loadChallenges();
  }, [filters, loadChallenges]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  }, [darkMode]);

  // Memoized values
  const themeClasses = useMemo(() => ({
    background: darkMode 
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
      : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900',
    nav: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    sidebar: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    button: darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
  }), [darkMode]);

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${themeClasses.background}`}>
      {/* Navigation */}
      <ChallengeNavbar
        darkMode={darkMode}
        showSidebar={showSidebar}
        toggleDarkMode={toggleDarkMode}
        toggleSidebar={() => setShowSidebar(!showSidebar)}
      />

      <div className="flex w-full pt-20">
        {/* Sidebar */}
        <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r flex flex-col ${themeClasses.sidebar}`}>
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h1 className="text-xl font-bold">Coding Challenges</h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Practice coding with interactive challenges
            </p>
          </div>

          {/* Filters */}
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Technology
              </label>
              <select
                value={filters.technology}
                onChange={(e) => setFilters(prev => ({ ...prev, technology: e.target.value }))}
                className={`w-full border rounded px-3 py-2 transition-colors ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {TECHNOLOGIES.map(tech => (
                  <option key={tech} value={tech}>
                    {tech === 'all' ? 'All Technologies' : tech.charAt(0).toUpperCase() + tech.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                className={`w-full border rounded px-3 py-2 transition-colors ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {DIFFICULTIES.map(diff => (
                  <option key={diff} value={diff}>
                    {diff === 'all' ? 'All Difficulties' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate AI Challenge Button */}
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={generateAIChallenge}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : darkMode
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>{loading ? 'Generating...' : 'Generate AI Challenge'}</span>
            </button>
          </div>

          {/* Challenges List */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto ${
                  darkMode ? 'border-white' : 'border-blue-600'
                }`}></div>
                <p className="mt-2">Loading challenges...</p>
              </div>
            ) : challenges.length === 0 ? (
              <div className="text-center py-8">
                <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>
                  🚀
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  No Challenges Yet
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Generate your first AI challenge to get started!
                </p>
                <button
                  onClick={generateAIChallenge}
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : darkMode
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  {loading ? 'Generating...' : 'Generate First Challenge'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {challenges.map((challenge, index) => (
                  <div
                    key={`${challenge.id}-${index}`}
                    onClick={() => handleChallengeSelect(challenge)}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedChallenge?.id === challenge.id
                        ? darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-300'
                        : darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <h3 className="font-semibold text-sm">{challenge.title}</h3>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {challenge.description.substring(0, 80)}...
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={getDifficultyClasses(challenge.difficulty, darkMode)}>
                        {challenge.difficulty}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {challenge.technology}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className={`${showSidebar ? 'flex-1' : 'w-full'} flex flex-col transition-all duration-300`}>
          {selectedChallenge ? (
            <div className="flex flex-col h-full">
              {/* Challenge Header */}
              <div className={`p-4 border-b transition-colors ${themeClasses.sidebar}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{selectedChallenge.title}</h2>
                    <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedChallenge.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className={getDifficultyClasses(selectedChallenge.difficulty, darkMode)}>
                        {selectedChallenge.difficulty}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {selectedChallenge.technology}
                      </span>
                    </div>
                  </div>
                  
                  <ChallengeButtons
                    selectedChallenge={selectedChallenge}
                    hintSolutionState={hintSolutionState}
                    setHintSolutionState={setHintSolutionState}
                    code={code}
                    setCode={setCode}
                    showPreview={showPreview}
                    setShowPreview={setShowPreview}
                    isExecuting={isExecuting}
                    onSubmitCode={evaluateCode}
                    onRunCode={executeCode}
                    darkMode={darkMode}
                  />
                </div>

                {/* Hints */}
                {hintSolutionState === 'hints' && (
                  <div className="mt-4 p-3 bg-yellow-900 border border-yellow-600 rounded">
                    <h4 className="font-semibold text-yellow-200 mb-2">💡 Hints:</h4>
                    <ul className="text-yellow-100 text-sm space-y-1">
                      {selectedChallenge.hints.map((hint, index) => (
                        <li key={index}>• {hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Editor and Preview Area */}
              <div className="flex-1 flex flex-col min-h-0 relative">
                {/* Terminal will be positioned fixed at bottom */}

                {/* Editor and Preview Row */}
                <div className="flex h-full min-h-0">
                  <div className={showPreview ? 'w-1/2' : 'w-full'}>
                    <Editor
                      language={selectedChallenge.technology}
                      value={code}
                      onChange={(value) => setCode(value || '')}
                      height="100%"
                      theme={darkMode ? 'vs-dark' : 'light'}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                      }}
                    />
                  </div>
                  
                  {showPreview && selectedChallenge && ['react', 'html', 'css'].includes(selectedChallenge.technology) && (
                    <div className="w-1/2 border-l border-gray-300">
                      <DelayedPreview code={code} language={selectedChallenge.technology} delay={2000} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={`flex-1 flex items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Code?</h2>
                <p>Choose a coding challenge from the sidebar to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Fixed Terminal at Bottom */}
      <ResizableTerminal
        output={terminalOutput}
        onClose={() => setTerminalOutput('')}
        onSubmit={evaluateCode}
        darkMode={darkMode}
      />
    </div>
  );
}