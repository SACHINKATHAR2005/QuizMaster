'use client';

import React from 'react';

interface ChallengeNavbarProps {
  darkMode: boolean;
  showSidebar: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

export default function ChallengeNavbar({ 
  darkMode, 
  showSidebar, 
  toggleDarkMode, 
  toggleSidebar 
}: ChallengeNavbarProps) {
  const themeClasses = {
    nav: darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
    button: darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 shadow-sm border-b transition-colors duration-300 ${themeClasses.nav}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu */}
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-colors ${themeClasses.button} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Toggle sidebar"
            >
              <svg 
                className={`w-5 h-5 transform transition-transform duration-200 ${showSidebar ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {showSidebar ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">C</span>
              </div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodeMaster
              </span>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${themeClasses.button} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Toggle dark mode"
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
            
            {/* Dashboard button */}
            <button
              onClick={() => window.location.href = '/dashboard'}
              className={`px-3 py-2 sm:px-4 rounded-lg transition-colors text-sm sm:text-base ${themeClasses.button} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
