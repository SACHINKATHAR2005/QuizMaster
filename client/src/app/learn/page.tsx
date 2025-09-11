'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const learningPaths = {
  javascript: {
    title: "JavaScript Fundamentals",
    description: "Learn JavaScript from basics to advanced concepts",
    roadmap: [
      { id: 1, title: "Variables & Data Types", completed: false },
      { id: 2, title: "Functions & Scope", completed: false },
      { id: 3, title: "Arrays & Objects", completed: false },
      { id: 4, title: "Async Programming", completed: false },
      { id: 5, title: "DOM Manipulation", completed: false }
    ]
  },
  python: {
    title: "Python Programming",
    description: "Master Python programming step by step",
    roadmap: [
      { id: 1, title: "Python Basics", completed: false },
      { id: 2, title: "Data Structures", completed: false },
      { id: 3, title: "Functions & Modules", completed: false },
      { id: 4, title: "File Handling", completed: false },
      { id: 5, title: "Object-Oriented Programming", completed: false }
    ]
  },
  react: {
    title: "React Development",
    description: "Build modern web apps with React",
    roadmap: [
      { id: 1, title: "JSX & Components", completed: false },
      { id: 2, title: "Props & State", completed: false },
      { id: 3, title: "Hooks & Effects", completed: false },
      { id: 4, title: "State Management", completed: false },
      { id: 5, title: "API Integration", completed: false }
    ]
  }
};

export default function LearnPage() {
  const [selectedPath, setSelectedPath] = useState<string>('');
  const router = useRouter();

  const handleStartLearning = (pathKey: string, stepId: number) => {
    // Navigate to code editor with specific challenge
    router.push(`/code-editor?path=${pathKey}&step=${stepId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Choose Your Learning Path
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(learningPaths).map(([key, path]) => (
            <div key={key} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{path.title}</h2>
              <p className="text-gray-600 mb-6">{path.description}</p>
              
              <div className="space-y-3">
                {path.roadmap.map((step) => (
                  <div 
                    key={step.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleStartLearning(key, step.id)}
                  >
                    <span className="text-gray-800">{step.title}</span>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      Start
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Progress: 0/{path.roadmap.length} completed
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
