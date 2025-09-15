'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function NotificationSystem() {
  const { notifications, removeNotification } = useAppStore();

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    notifications.forEach((notification) => {
      if (Date.now() - notification.timestamp > 5000) {
        removeNotification(notification.id);
      }
    });
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            max-w-sm p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform
            ${notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : ''}
            ${notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' : ''}
            ${notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' : ''}
            ${notification.type === 'info' ? 'bg-blue-50 border-blue-500 text-blue-800' : ''}
            hover:scale-105 cursor-pointer
          `}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {notification.type === 'success' && (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {notification.type === 'warning' && (
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
