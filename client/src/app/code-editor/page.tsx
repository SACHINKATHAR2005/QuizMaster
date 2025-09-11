'use client';

import { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import ReactPreview from '@/components/ReactPreview';
import { codeAPI, fileAPI } from '@/lib/api';

export default function CodeEditorPage() {
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [currentLanguage, setCurrentLanguage] = useState('javascript');
  const [currentCode, setCurrentCode] = useState('// Write your JavaScript code here\nconsole.log("Hello World!");');
  const [currentFileName, setCurrentFileName] = useState('');
  const [userFiles, setUserFiles] = useState<any[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showFileList, setShowFileList] = useState(false);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [openedFileId, setOpenedFileId] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'split' | 'full'>('split');

  const handleRunCode = async (code: string, language: string) => {
    setOutput('');
    setError('');
    setCurrentLanguage(language);
    setCurrentCode(code); // Update current code when running
    
    try {
      const response = await codeAPI.execute({
        code: code,
        language: language
      });
      
      if (response.data.success) {
        setOutput(response.data.output);
      } else {
        setError(response.data.error || 'Code execution failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error running code: ' + String(err));
    }
  };

  const clearTerminal = () => {
    setOutput('');
    setError('');
  };

  const loadUserFiles = async () => {
    try {
      const response = await fileAPI.list();
      if (response.data.success) {
        setUserFiles(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load files:', err);
    }
  };

  const handleSaveFile = async () => {
    if (!currentFileName.trim()) {
      alert('Please enter a file name');
      return;
    }

    if (!currentCode.trim()) {
      alert('No code to save');
      return;
    }

    console.log('Saving file:', { fileName: currentFileName, language: currentLanguage, codeLength: currentCode.length });

    try {
      const response = await fileAPI.save({
        fileName: currentFileName,
        language: currentLanguage,
        code: currentCode
      });

      if (response.data.success) {
        setShowSaveDialog(false);
        setIsFileOpen(true);
        setOpenedFileId(response.data.data._id);
        loadUserFiles();
        alert('File saved successfully!');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save file');
    }
  };

  const handleLoadFile = async (fileName: string) => {
    try {
      const response = await fileAPI.load(fileName);
      if (response.data.success) {
        const file = response.data.data;
        setCurrentCode(file.code);
        setCurrentLanguage(file.language);
        setCurrentFileName(fileName);
        setIsFileOpen(true);
        setOpenedFileId(file._id);
        setShowFileList(false);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to load file');
    }
  };

  const handleNewFile = () => {
    if (!newFileName.trim()) {
      alert('Please enter a file name');
      return;
    }
    
    const defaultCodes = {
      javascript: 'function App() {\n  return (\n    <div>\n      <h1>Hello React!</h1>\n      <p>Edit this component to see live preview</p>\n    </div>\n  );\n}',
      python: '# Write your Python code here\nprint("Hello World!")',
      typescript: 'function App(): JSX.Element {\n  return (\n    <div>\n      <h1>Hello TypeScript + React!</h1>\n      <p>Type-safe React component</p>\n    </div>\n  );\n}',
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n  <p>Edit this HTML to see live preview</p>\n</body>\n</html>',
      css: '/* Write your CSS code here */\nbody {\n  font-family: Arial, sans-serif;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  padding: 20px;\n}\n\nh1 {\n  text-align: center;\n  font-size: 2.5em;\n}'
    };
    
    setCurrentCode(defaultCodes[currentLanguage as keyof typeof defaultCodes]);
    setCurrentFileName(newFileName);
    setIsFileOpen(false); // New file, not saved yet
    setOpenedFileId('');
    setShowNewFileDialog(false);
    setNewFileName('');
  };

  const handleCodeChange = async (code: string) => {
    setCurrentCode(code);
    // Auto-save if file is open
    if (isFileOpen && currentFileName && openedFileId) {
      try {
        await fileAPI.save({
          fileName: currentFileName,
          language: currentLanguage,
          code: code
        });
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }
  };

  useEffect(() => {
    loadUserFiles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">Code Editor</h1>
          <a 
            href="/challenges"
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Challenges
          </a>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSaveDialog(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Save {currentFileName && `(${currentFileName})`}
          </button>
          {currentFileName ? (
            <span className="text-gray-300 text-sm flex items-center gap-1">
              {isFileOpen ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              )}
              {currentFileName}
            </span>
          ) : (
            <span className="text-gray-500 text-sm flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Mode
            </span>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* File Explorer */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
            <span className="text-gray-300 text-sm font-medium">Explorer</span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setCurrentCode('function App() {\n  return (\n    <div>\n      <h1>Hello React!</h1>\n      <p>Quick mode - no file needed</p>\n    </div>\n  );\n}');
                  setCurrentFileName('');
                  setIsFileOpen(false);
                  setOpenedFileId('');
                  setCurrentLanguage('javascript');
                  setShowPreview(true);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1 rounded"
                title="Clear - work without file"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
              <button
                onClick={() => setShowNewFileDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
              >
                + New
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="text-gray-400 text-xs uppercase tracking-wide mb-2">Your Files</div>
              {userFiles.length === 0 ? (
                <div className="text-gray-500 text-sm">No files yet</div>
              ) : (
                <div className="space-y-1">
                  {userFiles.map((file) => (
                    <div
                      key={file._id}
                      onClick={() => handleLoadFile(file.fileName)}
                      className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer text-sm"
                    >
                      {file.language === 'python' ? (
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      <span className={`truncate ${
                        currentFileName === file.fileName && isFileOpen 
                          ? 'text-blue-300 font-medium' 
                          : 'text-gray-300'
                      }`}>
                        {file.fileName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Terminal Overlay - VS Code Style */}
          {isTerminalVisible && (
            <div 
              className="absolute bottom-0 left-0 right-0 bg-black border-t border-gray-700 flex flex-col"
              style={{ 
                height: `${terminalHeight}px`, 
                zIndex: 100
              }}
            >
              {/* Terminal Header with Resize Handle */}
              <div 
                className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between cursor-row-resize select-none"
                onMouseDown={(e) => {
                  const startY = e.clientY;
                  const startHeight = terminalHeight;
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    const deltaY = startY - e.clientY;
                    const newHeight = Math.max(100, Math.min(600, startHeight + deltaY));
                    setTerminalHeight(newHeight);
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 text-sm">Terminal Output</span>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Drag to resize
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTerminalHeight(150)}
                    className="text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-gray-700 rounded"
                    title="Minimize"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setTerminalHeight(400)}
                    className="text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-gray-700 rounded"
                    title="Maximize"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { setOutput(''); setError(''); }}
                    className="text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-gray-700 rounded"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsTerminalVisible(false)}
                    className="text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-gray-700 rounded"
                    title="Close Terminal"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-black text-green-400 p-4 overflow-auto font-mono text-sm">
                {/* Terminal Header */}
                <div className="text-gray-500 mb-2">
                  $ {currentLanguage === 'python' ? 'python script.py' : 'node script.js'}
                </div>
                
                {error && (
                  <div className="text-red-400 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Error: {error}
                  </div>
                )}
                
                {output && (
                  <div>
                    <pre className="whitespace-pre-wrap text-green-400">{output}</pre>
                    <div className="text-gray-500 mt-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Process finished with exit code 0
                    </div>
                  </div>
                )}
                
                {!output && !error && (
                  <div className="text-gray-500">
                    Ready to execute code...
                  </div>
                )}
                
                {/* Cursor */}
                <div className="flex items-center mt-2">
                  <span className="text-gray-500">$ </span>
                  <div className="w-2 h-4 bg-green-400 animate-pulse ml-1"></div>
                </div>
              </div>
            </div>
          )}

          {/* Editor and Preview Container */}
          <div className="flex-1 flex min-h-0">
            {/* Code Editor */}
            <div className={`flex flex-col ${
              showPreview 
                ? previewMode === 'split' ? 'w-1/2' : 'hidden'
                : 'flex-1'
            }`}>
              {/* Editor Header */}
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                <span className="text-gray-300 text-sm">Code Editor</span>
                <div className="flex gap-2">
                  {!isTerminalVisible && (
                    <button 
                      onClick={() => setIsTerminalVisible(true)}
                      className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded"
                    >
                      Terminal
                    </button>
                  )}
                  {['javascript', 'typescript', 'html', 'css'].includes(currentLanguage) && (
                    <>
                      <button 
                        onClick={() => setShowPreview(!showPreview)}
                        className={`text-xs px-2 py-1 rounded ${
                          showPreview 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                      >
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                      </button>
                      {showPreview && (
                        <button 
                          onClick={() => setPreviewMode(previewMode === 'split' ? 'full' : 'split')}
                          className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded"
                        >
                          {previewMode === 'split' ? (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {/* Code Editor */}
              <div className="flex-1">
                <CodeEditor
                  language={currentLanguage}
                  defaultValue={currentCode}
                  height="100%"
                  onRun={(code, lang) => {
                    setCurrentCode(code);
                    setCurrentLanguage(lang);
                    handleRunCode(code, lang);
                    if (!isTerminalVisible) setIsTerminalVisible(true);
                  }}
                  onLanguageChange={(lang) => {
                    setCurrentLanguage(lang);
                    clearTerminal();
                    // Auto-show preview for web languages
                    if (['javascript', 'typescript', 'html', 'css'].includes(lang)) {
                      setShowPreview(true);
                    } else {
                      setShowPreview(false);
                    }
                  }}
                  onChange={(code) => handleCodeChange(code || '')}
                />
              </div>
            </div>
            
            {/* Live Preview */}
            {showPreview && (
              <div className={`flex flex-col border-l border-gray-700 ${
                previewMode === 'split' ? 'w-1/2' : 'flex-1'
              }`}>
                <ReactPreview 
                  code={currentCode} 
                  language={currentLanguage}
                />
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* New File Dialog */}
      {showNewFileDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Create New File</h3>
            <input
              type="text"
              placeholder="Enter file name (e.g., my-script.js)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleNewFile()}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleNewFile}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create
              </button>
              <button
                onClick={() => { setShowNewFileDialog(false); setNewFileName(''); }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Save File</h3>
            <input
              type="text"
              placeholder="Enter file name (e.g., my-script.js)"
              value={currentFileName}
              onChange={(e) => setCurrentFileName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveFile}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File List Dialog */}
      {showFileList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Your Files</h3>
            {userFiles.length === 0 ? (
              <p className="text-gray-500">No saved files yet</p>
            ) : (
              <div className="space-y-2">
                {userFiles.map((file) => (
                  <div
                    key={file._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handleLoadFile(file.fileName)}
                  >
                    <div>
                      <div className="font-medium">{file.fileName}</div>
                      <div className="text-sm text-gray-500">{file.language}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(file.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowFileList(false)}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
