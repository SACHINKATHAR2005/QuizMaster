'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ResizableTerminalProps {
  output: string;
  onClose: () => void;
  onSubmit?: () => void;
  darkMode: boolean;
}

export default function ResizableTerminal({ output, onClose, onSubmit, darkMode }: ResizableTerminalProps) {
  const [height, setHeight] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newHeight = window.innerHeight - e.clientY;
      const minHeight = 150;
      const maxHeight = window.innerHeight * 0.6;
      
      setHeight(Math.min(Math.max(newHeight, minHeight), maxHeight));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (!output) return null;

  return (
    <div 
      ref={terminalRef}
      className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 flex flex-col shadow-2xl"
      style={{ height: `${height}px`, zIndex: 100 }}
    >
      {/* Resize Handle */}
      <div
        className="h-2 bg-gray-600 hover:bg-blue-500 cursor-row-resize transition-colors flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >
        <div className="w-8 h-1 bg-gray-400 rounded-full"></div>
      </div>
      
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-300 text-sm font-medium ml-2">📟 Terminal Output</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-sm px-2 py-1 hover:bg-gray-700 rounded transition-colors"
        >
          ✕
        </button>
      </div>
      
      {/* Terminal Content */}
      <div className="flex-1 p-4 overflow-y-auto bg-black">
        <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
          {output || 'Terminal ready. Run your code to see output here...'}
        </pre>
        
        {/* Submit Button in Terminal */}
        {onSubmit && output && !output.includes('evaluation completed') && (
          <div className="mt-4 pt-3 border-t border-gray-600">
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              📝 Submit for AI Evaluation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
