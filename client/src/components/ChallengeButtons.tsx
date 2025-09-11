'use client';

import React from 'react';
import { Challenge } from '../utils/challengeUtils';

interface ChallengeButtonsProps {
  selectedChallenge: Challenge;
  hintSolutionState: 'none' | 'hints' | 'solution';
  setHintSolutionState: (state: 'none' | 'hints' | 'solution') => void;
  code: string;
  setCode: (code: string) => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  isExecuting: boolean;
  onSubmitCode: () => void;
  onRunCode: () => void;
  darkMode: boolean;
}

export default function ChallengeButtons({
  selectedChallenge,
  hintSolutionState,
  setHintSolutionState,
  code,
  setCode,
  showPreview,
  setShowPreview,
  isExecuting,
  onSubmitCode,
  onRunCode,
  darkMode
}: ChallengeButtonsProps) {
  
  const handleHintSolutionClick = () => {
    if (hintSolutionState === 'none') {
      setHintSolutionState('hints');
    } else if (hintSolutionState === 'hints') {
      setHintSolutionState('solution');
      // Comment out user code and show solution
      const commentedCode = code.split('\n').map(line => line.trim() ? `// ${line}` : '//').join('\n');
      const solutionCode = `${commentedCode}\n\n// ✨ SOLUTION:\n${selectedChallenge.solution || ''}`;
      setCode(solutionCode);
    } else {
      setHintSolutionState('none');
      setCode(selectedChallenge.starterCode || '');
    }
  };

  const getHintSolutionButtonStyle = () => {
    const baseStyle = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm";
    
    switch (hintSolutionState) {
      case 'none':
        return `${baseStyle} bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white focus:ring-yellow-500`;
      case 'hints':
        return `${baseStyle} bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white focus:ring-green-500`;
      default:
        return `${baseStyle} bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white focus:ring-gray-500`;
    }
  };

  const getHintSolutionButtonText = () => {
    switch (hintSolutionState) {
      case 'none': return '💡 Get Hint';
      case 'hints': return '🔍 Show Solution';
      default: return '↩️ Reset Code';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Hint/Solution Button */}
      <button
        onClick={handleHintSolutionClick}
        className={getHintSolutionButtonStyle()}
      >
        {getHintSolutionButtonText()}
      </button>

      {/* Preview Button (for web technologies) */}
      {['react', 'html', 'css'].includes(selectedChallenge.technology) && (
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
        >
          {showPreview ? '🙈 Hide Preview' : '👁️ Show Preview'}
        </button>
      )}

      {/* Run Code Button */}
      <button
        onClick={onRunCode}
        disabled={isExecuting || !code.trim()}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
      >
        {isExecuting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Running...
          </span>
        ) : (
          '▶️ Run Code'
        )}
      </button>
    </div>
  );
}
