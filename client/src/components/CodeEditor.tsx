'use client';

import { Editor } from '@monaco-editor/react';
import { useState } from 'react';

interface CodeEditorProps {
  language?: string;
  defaultValue?: string;
  height?: string;
  theme?: string;
  onChange?: (value: string | undefined) => void;
  onRun?: (code: string, language: string) => void;
  onLanguageChange?: (language: string) => void;
}

export default function CodeEditor({
  language: initialLanguage = 'javascript',
  defaultValue = '// Write your code here\n// Output: Hello World',
  height = '400px',
  theme = 'vs-dark',
  onChange,
  onRun,
  onLanguageChange
}: CodeEditorProps) {
  const [code, setCode] = useState(defaultValue);
  const [language, setLanguage] = useState(initialLanguage);
  const [isRunning, setIsRunning] = useState(false);

  // Update default code when language changes
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    
    // Set appropriate default code for each language
    const defaultCodes = {
      javascript: '// Write your JavaScript code here\n// Output: Hello World',
      python: '# Write your Python code here\nprint("Hello World!")',
      typescript: '// Write your TypeScript code here\n// Output: Hello World',
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>',
      css: '/* Write your CSS code here */\nbody {\n  font-family: Arial, sans-serif;\n  background-color: #f0f0f0;\n}'
    };
    
    const newDefaultCode = defaultCodes[newLanguage as keyof typeof defaultCodes] || code;
    setCode(newDefaultCode);
    onChange?.(newDefaultCode);
    
    // Clear terminal when language changes
    onLanguageChange?.(newLanguage);
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
    onChange?.(value);
  };

  const handleRunCode = async () => {
    if (!onRun) return;
    
    setIsRunning(true);
    try {
      await onRun(code, language);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">Language:</span>
          <select 
            value={language} 
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-gray-700 text-white px-2 py-1 rounded text-sm border border-gray-600"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </div>
        {onRun && (
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2 font-medium"
          >
            {isRunning ? (
              <>
                <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full"></div>
                Running...
              </>
            ) : (
              <>
                ▶ Run Code
              </>
            )}
          </button>
        )}
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme={theme}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
}
