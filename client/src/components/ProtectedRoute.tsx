'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user, token } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if there's a token in localStorage
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        // If we have a token but no user data, initialize auth
        if (!isAuthenticated && !user) {
          const { initializeAuth } = useAuthStore.getState();
          initializeAuth();
        }
        setIsLoading(false);
      } else {
        // No token, redirect to signin
        router.push('/signin');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, user, token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Allow access if there's a token or user is authenticated
  if (!isAuthenticated && !user && !localStorage.getItem('token')) {
    return null; // Will redirect to signin
  }

  return <>{children}</>;
}
