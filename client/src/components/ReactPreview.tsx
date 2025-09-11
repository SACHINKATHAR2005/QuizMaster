'use client';

import { useEffect, useRef, useState } from 'react';

interface ReactPreviewProps {
  code: string;
  language: string;
}

export default function ReactPreview({ code, language }: ReactPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateReactPreview = (jsxCode: string) => {
    // Escape the code properly for template literal
    const escapedCode = jsxCode
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\${/g, '\\${');

    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>React Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #f5f5f5;
    }
    .error {
      background: #fee;
      border: 1px solid #fcc;
      padding: 10px;
      border-radius: 4px;
      color: #c33;
      font-family: monospace;
      white-space: pre-wrap;
    }
    .preview-container {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    
    try {
      // User code
      ${escapedCode}
      
      // Find the component to render - look for any function that returns JSX
      let ComponentToRender = null;
      
      // First try common component names
      const commonNames = ['AlertButton', 'App', 'Counter', 'TodoApp', 'ProfileCard', 'ColorPicker', 'ContactForm', 'Toggle', 'Button'];
      
      for (const name of commonNames) {
        if (typeof window[name] === 'function') {
          ComponentToRender = window[name];
          break;
        }
      }
      
      // If no common names found, look for any function in window that might be a component
      if (!ComponentToRender) {
        for (const key in window) {
          if (typeof window[key] === 'function' && 
              key[0] === key[0].toUpperCase() && // Component names start with uppercase
              key !== 'React' && key !== 'ReactDOM' && 
              !key.startsWith('_') && 
              key.length > 1) {
            ComponentToRender = window[key];
            break;
          }
        }
      }
      
      if (ComponentToRender) {
        ReactDOM.render(<ComponentToRender />, document.getElementById('root'));
      } else {
        throw new Error('No React component found. Please define a function component with an uppercase name like: function AlertButton() { return <button>Click me</button>; }');
      }
      
    } catch (error) {
      document.getElementById('root').innerHTML = \`
        <div class="error">
          <strong>Error:</strong>
          \${error.message}
          
          <br><br>
          <strong>Tips:</strong>
          • Make sure your JSX is valid
          • Use function components: function App() { return <div>Hello</div>; }
          • Component name should be: App, Counter, TodoApp, ProfileCard, ColorPicker, or ContactForm
          • Remember to return JSX from your component
        </div>
      \`;
    }
  </script>
</body>
</html>`;
    return htmlTemplate;
  };

  const generateHTMLPreview = (htmlCode: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>HTML Preview</title>
  <style>
    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  ${htmlCode}
</body>
</html>`;
  };

  const generateCSSPreview = (cssCode: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CSS Preview</title>
  <style>
    ${cssCode}
  </style>
</head>
<body>
  <div style="padding: 20px;">
    <h1>CSS Preview</h1>
    <p>This is a paragraph to show your CSS styles.</p>
    <div class="example">Example div with class "example"</div>
    <button>Example Button</button>
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
    </ul>
  </div>
</body>
</html>`;
  };

  useEffect(() => {
    if (!code.trim()) return;

    setIsLoading(true);
    
    let htmlContent = '';
    
    if (language === 'react' || language === 'javascript' || language === 'typescript') {
      // For React/JSX code
      htmlContent = generateReactPreview(code);
    } else if (language === 'html') {
      htmlContent = generateHTMLPreview(code);
    } else if (language === 'css') {
      htmlContent = generateCSSPreview(code);
    } else {
      htmlContent = '<div style="padding: 20px;">Preview not available for this language</div>';
    }

    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.srcdoc = htmlContent;
      
      iframe.onload = () => {
        setIsLoading(false);
      };
    }
  }, [code, language]);

  if (language === 'python') {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 text-gray-600">
        <div className="text-center">
          <div className="text-4xl mb-4">🐍</div>
          <div>Live preview not available for Python</div>
          <div className="text-sm mt-2">Use the terminal to see output</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
        <span className="text-gray-300 text-sm">Live Preview</span>
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <div className="animate-spin h-3 w-3 border border-gray-400 border-t-transparent rounded-full"></div>
            Loading...
          </div>
        )}
      </div>
      <div className="flex-1">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-modals allow-popups"
          title="Live Preview"
        />
      </div>
    </div>
  );
}
