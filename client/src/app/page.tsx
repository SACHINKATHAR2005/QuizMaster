'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if there's a token in localStorage and restore authentication
    const storedToken = localStorage.getItem('token');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    if (storedToken && !isAuthenticated) {
      router.push('/dashboard');
    } else if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, token, router]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
    }`}>
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
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
          <Button
            variant="ghost"
            onClick={() => router.push('/signin')}
            className={darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}
          >
            Sign In
          </Button>
          <Button
            onClick={() => router.push('/signup')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI-Powered Learning Platform
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Master
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {' '}Coding
            </span>
            <br />
            with AI
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-80">
            Interactive coding challenges, AI-powered quizzes, and real-time code execution. 
            Build your programming skills with personalized learning paths.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => router.push('/signup')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Start Coding Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/signin')}
              className={`text-xl px-12 py-6 rounded-2xl border-2 transition-all duration-300 flex items-center gap-2 ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Demo Playground
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">500+</div>
              <div className="text-sm opacity-70">Coding Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">10K+</div>
              <div className="text-sm opacity-70">Quiz Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">15+</div>
              <div className="text-sm opacity-70">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">AI</div>
              <div className="text-sm opacity-70">Powered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Excel
            </span>
          </h2>
          <p className="text-xl opacity-70 max-w-3xl mx-auto">
            From beginner-friendly tutorials to advanced coding challenges, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Interactive Code Editor */}
          <div className={`p-8 rounded-3xl transition-all duration-300 hover:scale-105 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'
          }`}>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Interactive Code Editor</h3>
            <p className="opacity-70 mb-4">
              VS Code-style editor with syntax highlighting, auto-completion, and real-time execution.
            </p>
            <ul className="space-y-2 text-sm opacity-60">
              <li>• Multi-language support (JS, Python, TypeScript)</li>
              <li>• Live preview for web technologies</li>
              <li>• Integrated terminal with code execution</li>
            </ul>
          </div>

          {/* AI-Powered Challenges */}
          <div className={`p-8 rounded-3xl transition-all duration-300 hover:scale-105 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'
          }`}>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">AI-Powered Challenges</h3>
            <p className="opacity-70 mb-4">
              Dynamic coding challenges generated by AI, tailored to your skill level and learning goals.
            </p>
            <ul className="space-y-2 text-sm opacity-60">
              <li>• Personalized difficulty progression</li>
              <li>• Real-world problem scenarios</li>
              <li>• Instant AI feedback and hints</li>
            </ul>
          </div>

          {/* Smart Quizzes */}
          <div className={`p-8 rounded-3xl transition-all duration-300 hover:scale-105 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'
          }`}>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Smart Quizzes</h3>
            <p className="opacity-70 mb-4">
              AI-generated quizzes with intelligent explanations for wrong answers and adaptive learning.
            </p>
            <ul className="space-y-2 text-sm opacity-60">
              <li>• Adaptive question difficulty</li>
              <li>• Detailed AI explanations</li>
              <li>• Progress tracking & analytics</li>
            </ul>
          </div>

          {/* Real-time Collaboration */}
          <div className={`p-8 rounded-3xl transition-all duration-300 hover:scale-105 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'
          }`}>
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Live Code Execution</h3>
            <p className="opacity-70 mb-4">
              Run your code instantly in the browser with our secure execution environment.
            </p>
            <ul className="space-y-2 text-sm opacity-60">
              <li>• Instant feedback and results</li>
              <li>• Secure sandboxed execution</li>
              <li>• Multiple runtime environments</li>
            </ul>
          </div>

          {/* Progress Dashboard */}
          <div className={`p-8 rounded-3xl transition-all duration-300 hover:scale-105 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'
          }`}>
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Progress Dashboard</h3>
            <p className="opacity-70 mb-4">
              Comprehensive analytics showing your learning journey, strengths, and areas for improvement.
            </p>
            <ul className="space-y-2 text-sm opacity-60">
              <li>• Detailed performance metrics</li>
              <li>• Skill progression tracking</li>
              <li>• Achievement system</li>
            </ul>
          </div>

          {/* File Management */}
          <div className={`p-8 rounded-3xl transition-all duration-300 hover:scale-105 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'
          }`}>
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Project Management</h3>
            <p className="opacity-70 mb-4">
              Save, organize, and manage your coding projects with cloud storage and version control.
            </p>
            <ul className="space-y-2 text-sm opacity-60">
              <li>• Cloud-based file storage</li>
              <li>• Project organization</li>
              <li>• Auto-save functionality</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className={`text-center p-16 rounded-3xl ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Level Up Your Coding Skills?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of developers who are already mastering programming with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/signup')}
              className={`text-xl px-12 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  : 'bg-white text-blue-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/code-editor')}
              className={`text-xl px-12 py-6 rounded-2xl border-2 transition-all duration-300 flex items-center gap-2 ${
                darkMode 
                  ? 'border-gray-400 text-gray-300 hover:bg-gray-700' 
                  : 'border-white text-white hover:bg-white hover:text-blue-600'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1" />
              </svg>
              Try Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t py-12 ${
        darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CodeMaster
                </span>
              </div>
              <p className="opacity-70">
                Empowering developers with AI-driven learning experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 opacity-70">
                <li><a href="/challenges" className="hover:opacity-100">Challenges</a></li>
                <li><a href="/quiz" className="hover:opacity-100">Quizzes</a></li>
                <li><a href="/code-editor" className="hover:opacity-100">Code Editor</a></li>
                <li><a href="/dashboard" className="hover:opacity-100">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Languages</h4>
              <ul className="space-y-2 opacity-70">
                <li>JavaScript / TypeScript</li>
                <li>Python</li>
                <li>React / Next.js</li>
                <li>HTML / CSS</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 opacity-70">
                <li>AI Code Evaluation</li>
                <li>Real-time Execution</li>
                <li>Progress Tracking</li>
                <li>Live Preview</li>
              </ul>
            </div>
          </div>
          <div className={`mt-12 pt-8 border-t text-center opacity-70 ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <p>&copy; 2025 CodeMaster. Built with AI for the future of coding education.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
