'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore, useQuizStore } from '@/lib/store';
import { quizAPI, challengeAPI } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const [quizForm, setQuizForm] = useState({
    topic: '',
  });
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [challengeHistory, setChallengeHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [quizTopic, setQuizTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [includeCodeQuestions, setIncludeCodeQuestions] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { currentQuiz, setCurrentQuiz } = useQuizStore();


  const loadQuizHistory = async () => {
    try {
      const response = await quizAPI.getAll();
      if (response.data.success) {
        setQuizHistory(response.data.data);
      } else {
      }
    } catch (err) {
    }
  };

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTopic.trim() || !difficulty) {
      setError('Please enter a topic and select difficulty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await quizAPI.generate({
        topic: quizTopic,
        difficulty: difficulty,
        includeCodeQuestions: includeCodeQuestions
      });
      if (response.data.success) {
        console.log('Quiz generated successfully:', response.data.data);
        // Store the generated quiz in the store
        setCurrentQuiz(response.data.data);
        // Navigate to the quiz page
        router.push('/quiz');
      }
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      setError(err.response?.data?.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleViewResult = (quizId: string) => {
    router.push(`/result/${quizId}`);
  };

  // Calculate dynamic stats from real data
  const dynamicStats = {
    challengesCompleted: challengeHistory.filter(c => c.completed).length,
    quizzesCompleted: quizHistory.filter(q => q.score !== undefined).length,
    totalScore: quizHistory.reduce((sum, quiz) => sum + (quiz.score || 0), 0),
    averageScore: quizHistory.length > 0 ? Math.round(quizHistory.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / quizHistory.length) : 0,
    streak: Math.min(quizHistory.length + challengeHistory.length, 7),
    rank: (quizHistory.length + challengeHistory.length) >= 10 ? 'Advanced' : (quizHistory.length + challengeHistory.length) >= 5 ? 'Intermediate' : 'Beginner'
  };


  const loadChallengeHistory = async () => {
    try {
      const response = await challengeAPI.getChallenges();
      if (response.data.success) {
        setChallengeHistory(response.data.data || []);
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    if (user) {
      loadQuizHistory();
      loadChallengeHistory();
    }
    const savedDarkMode = localStorage.getItem('darkMode');
    const defaultDarkMode = savedDarkMode !== null ? savedDarkMode === 'true' : true;
    setDarkMode(defaultDarkMode);
    if (savedDarkMode === null) {
      localStorage.setItem('darkMode', 'true');
    }
  }, [user]);

  // Combine quiz and challenge history for recent activity
  const recentActivity = [
    ...quizHistory.map(quiz => ({
      id: quiz._id,
      type: 'quiz',
      title: `${quiz.topic} Quiz`,
      score: quiz.score || null,
      status: quiz.score !== undefined ? 'completed' : 'pending',
      date: new Date(quiz.generatedAt).toLocaleDateString(),
      difficulty: quiz.difficulty,
      totalQuestions: quiz.questions?.length || 0,
      correctAnswers: quiz.correctAnswers || 0
    })),
    ...challengeHistory.slice(0, 3).map(challenge => ({
      id: challenge._id,
      type: 'challenge',
      title: challenge.title || `${challenge.technology} Challenge`,
      score: challenge.score || null,
      status: challenge.completed ? 'completed' : 'pending',
      date: new Date(challenge.createdAt || challenge.generatedAt).toLocaleDateString(),
      difficulty: challenge.difficulty,
      technology: challenge.technology
    }))
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

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
          <div className="w-full px-6 py-4">
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
                  Welcome, {user?.username}!
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="w-full px-6 py-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Dashboard
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Overview
              </span>
            </h1>
            <p className="opacity-70">Track your progress and continue your coding journey</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
              {[
                { id: 'overview', label: 'Overview', icon: 'chart' },
                { id: 'challenges', label: 'Challenges', icon: 'target' },
                { id: 'quizzes', label: 'Quizzes', icon: 'brain' },
                { id: 'generate', label: 'Generate', icon: 'sparkles' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? darkMode
                        ? 'bg-gray-700 text-white shadow-lg'
                        : 'bg-white text-gray-900 shadow-lg'
                      : darkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon === 'chart' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {tab.icon === 'target' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                  {tab.icon === 'brain' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {tab.icon === 'sparkles' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {dynamicStats.challengesCompleted}
                    </span>
                  </div>
                  <p className="text-sm opacity-70">Challenges Completed</p>
                </div>

                <div className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {dynamicStats.quizzesCompleted}
                    </span>
                  </div>
                  <p className="text-sm opacity-70">Quizzes Completed</p>
                </div>

                <div className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      {dynamicStats.averageScore}%
                    </span>
                  </div>
                  <p className="text-sm opacity-70">Average Score</p>
                </div>

                <div className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {dynamicStats.streak}
                    </span>
                  </div>
                  <p className="text-sm opacity-70">Day Streak</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`p-8 rounded-2xl ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
              }`}>
                <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => router.push('/challenges')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-6 h-auto flex flex-col items-center gap-2"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Practice Challenges</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('generate')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-6 h-auto flex flex-col items-center gap-2"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span>Generate Quiz</span>
                  </Button>
                  <Button
                    onClick={() => router.push('/code-editor')}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white p-6 h-auto flex flex-col items-center gap-2"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span>Code Editor</span>
                  </Button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className={`p-8 rounded-2xl ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
              }`}>
                <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-4xl mb-4 block">📊</span>
                      <p className="text-lg opacity-70 mb-4">No recent activity</p>
                      <p className="text-sm opacity-50">Start by generating a quiz or taking a challenge!</p>
                    </div>
                  ) : (
                    recentActivity.map((activity, index) => (
                      <div 
                        key={index} 
                        onClick={() => {
                          if (activity.type === 'quiz') {
                            if (activity.status === 'completed') {
                              router.push(`/result/${activity.id}`);
                            } else {
                              setCurrentQuiz(quizHistory.find(q => q._id === activity.id));
                              router.push('/quiz');
                            }
                          } else if (activity.type === 'challenge') {
                            router.push(`/challenges/${activity.id}`);
                          }
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${
                          darkMode ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {activity.type === 'challenge' ? (
                              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            )}
                            <div>
                              <h4 className="font-semibold">{activity.title}</h4>
                              <p className="text-sm opacity-70">
                                {activity.difficulty} • {activity.date}
                                {activity.type === 'quiz' && (activity as any).totalQuestions && (
                                  <span> • {(activity as any).correctAnswers || 0}/{(activity as any).totalQuestions} correct</span>
                                )}
                                {activity.type === 'challenge' && (activity as any).technology && (
                                  <span> • {(activity as any).technology}</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {activity.status === 'pending' ? (
                              <div className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                Pending
                              </div>
                            ) : activity.score !== null ? (
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                activity.score >= 90 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : activity.score >= 70
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {activity.score}%
                              </div>
                            ) : (
                              <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Completed
                              </div>
                            )}
                            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Generate Tab */}
          {activeTab === 'generate' && (
            <div className={`rounded-2xl p-8 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
            }`}>
              <h2 className="text-3xl font-bold mb-6">Generate New Quiz</h2>
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-md text-sm mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleGenerateQuiz} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Topic
                  </label>
                  <input
                    type="text"
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    placeholder="e.g., JavaScript, React, Python"
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                    required
                  >
                    <option value="">Select difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="includeCode"
                    checked={includeCodeQuestions}
                    onChange={(e) => setIncludeCodeQuestions(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeCode" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Include coding questions (write code solutions)
                  </label>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl"
                >
                  {loading ? '⏳ Generating...' : '🎯 Generate Quiz'}
                </Button>
              </form>
            </div>
          )}

          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <div className={`rounded-2xl p-8 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Quiz History</h2>
                <Button 
                  variant="outline" 
                  onClick={loadQuizHistory}
                  className="text-sm"
                >
                  🔄 Refresh
                </Button>
              </div>
              
              {quizHistory.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🧠</span>
                  <p className="text-xl opacity-70 mb-4">No quizzes taken yet</p>
                  <Button
                    onClick={() => setActiveTab('generate')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Generate Your First Quiz
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizHistory.map((quiz) => (
                    <div key={quiz._id} className={`border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                      darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{quiz.topic}</h3>
                          <div className="flex items-center gap-4 text-sm opacity-70">
                            <span>📊 {quiz.difficulty}</span>
                            <span>❓ {quiz.questions.length} questions</span>
                            <span>📅 {new Date(quiz.generatedAt).toLocaleDateString()}</span>
                            {quiz.score !== undefined && (
                              <span className={`px-2 py-1 rounded-full ${
                                quiz.score >= 8 ? 'bg-green-100 text-green-800' : 
                                quiz.score >= 6 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {quiz.score}/{quiz.questions.length}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {quiz.score !== undefined ? (
                            <Button
                              variant="outline"
                              onClick={() => handleViewResult(quiz._id)}
                            >
                              📊 View Results
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                setCurrentQuiz(quiz);
                                router.push('/quiz');
                              }}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                              ▶️ Continue Quiz
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div className={`rounded-2xl p-8 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Coding Challenges</h2>
                <Button 
                  onClick={() => router.push('/challenges')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  🎯 Browse All Challenges
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Challenge Categories */}
                {[
                  { name: 'React Components', count: 12, difficulty: 'Medium', icon: '⚛️' },
                  { name: 'JavaScript Algorithms', count: 8, difficulty: 'Hard', icon: '🔧' },
                  { name: 'Python Data Science', count: 6, difficulty: 'Easy', icon: '🐍' },
                  { name: 'TypeScript Types', count: 4, difficulty: 'Medium', icon: '📘' }
                ].map((category, index) => (
                  <div key={index} className={`p-6 rounded-xl border transition-all hover:scale-105 cursor-pointer ${
                    darkMode ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{category.icon}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        category.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {category.difficulty}
                      </span>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{category.name}</h4>
                    <p className="text-sm opacity-70">{category.count} challenges available</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
