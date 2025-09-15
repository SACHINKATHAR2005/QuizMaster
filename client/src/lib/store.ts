import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
}

interface QuizQuestion {
  questionId: string;
  questionText: string;
  codeSnippet?: string;
  language?: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  _id: string;
  userId: string;
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
  userAnswers?: string[];
  score?: number;
  correctAnswers?: number;
  generatedAt: string;
}

interface Challenge {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  technology: string;
  completed?: boolean;
  score?: number;
  createdAt: string;
  generatedAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

interface QuizState {
  currentQuiz: Quiz | null;
  quizHistory: Quiz[];
  loading: boolean;
  error: string | null;
  setCurrentQuiz: (quiz: Quiz) => void;
  setQuizHistory: (quizzes: Quiz[]) => void;
  clearCurrentQuiz: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addQuizToHistory: (quiz: Quiz) => void;
  updateQuizInHistory: (quizId: string, updates: Partial<Quiz>) => void;
}

interface AppState {
  darkMode: boolean;
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timestamp: number;
  }>;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface ChallengeState {
  challenges: Challenge[];
  currentChallenge: Challenge | null;
  challengeHistory: Challenge[];
  loading: boolean;
  error: string | null;
  setChallenges: (challenges: Challenge[]) => void;
  setCurrentChallenge: (challenge: Challenge | null) => void;
  setChallengeHistory: (challenges: Challenge[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addChallengeToHistory: (challenge: Challenge) => void;
  updateChallengeInHistory: (challengeId: string, updates: Partial<Challenge>) => void;
}

// Auth Store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      login: (user: User, token: string) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true, loading: false });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, loading: false });
      },
      setLoading: (loading: boolean) => set({ loading }),
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({ token, isAuthenticated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Quiz Store with persistence
export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentQuiz: null,
      quizHistory: [],
      loading: false,
      error: null,
      setCurrentQuiz: (quiz: Quiz) => set({ currentQuiz: quiz, error: null }),
      setQuizHistory: (quizzes: Quiz[]) => set({ quizHistory: quizzes }),
      clearCurrentQuiz: () => set({ currentQuiz: null }),
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      addQuizToHistory: (quiz: Quiz) => {
        const { quizHistory } = get();
        const existingIndex = quizHistory.findIndex(q => q._id === quiz._id);
        if (existingIndex >= 0) {
          const updatedHistory = [...quizHistory];
          updatedHistory[existingIndex] = quiz;
          set({ quizHistory: updatedHistory });
        } else {
          set({ quizHistory: [quiz, ...quizHistory] });
        }
      },
      updateQuizInHistory: (quizId: string, updates: Partial<Quiz>) => {
        const { quizHistory } = get();
        const updatedHistory = quizHistory.map(quiz => 
          quiz._id === quizId ? { ...quiz, ...updates } : quiz
        );
        set({ quizHistory: updatedHistory });
      },
    }),
    {
      name: 'quiz-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        quizHistory: state.quizHistory,
        currentQuiz: state.currentQuiz 
      }),
    }
  )
);

// App State Store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      darkMode: true,
      sidebarOpen: false,
      notifications: [],
      toggleDarkMode: () => {
        const { darkMode } = get();
        set({ darkMode: !darkMode });
      },
      toggleSidebar: () => {
        const { sidebarOpen } = get();
        set({ sidebarOpen: !sidebarOpen });
      },
      addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        const { notifications } = get();
        const newNotification = {
          id: Date.now().toString(),
          message,
          type,
          timestamp: Date.now(),
        };
        set({ notifications: [newNotification, ...notifications.slice(0, 4)] });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          const { removeNotification } = get();
          removeNotification(newNotification.id);
        }, 5000);
      },
      removeNotification: (id: string) => {
        const { notifications } = get();
        set({ notifications: notifications.filter(n => n.id !== id) });
      },
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        darkMode: state.darkMode,
        sidebarOpen: state.sidebarOpen 
      }),
    }
  )
);

// Challenge Store
export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: [],
  currentChallenge: null,
  challengeHistory: [],
  loading: false,
  error: null,
  setChallenges: (challenges: Challenge[]) => set({ challenges, error: null }),
  setCurrentChallenge: (challenge: Challenge | null) => set({ currentChallenge: challenge }),
  setChallengeHistory: (challenges: Challenge[]) => set({ challengeHistory: challenges }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  addChallengeToHistory: (challenge: Challenge) => {
    const { challengeHistory } = get();
    const existingIndex = challengeHistory.findIndex(c => c._id === challenge._id);
    if (existingIndex >= 0) {
      const updatedHistory = [...challengeHistory];
      updatedHistory[existingIndex] = challenge;
      set({ challengeHistory: updatedHistory });
    } else {
      set({ challengeHistory: [challenge, ...challengeHistory] });
    }
  },
  updateChallengeInHistory: (challengeId: string, updates: Partial<Challenge>) => {
    const { challengeHistory } = get();
    const updatedHistory = challengeHistory.map(challenge => 
      challenge._id === challengeId ? { ...challenge, ...updates } : challenge
    );
    set({ challengeHistory: updatedHistory });
  },
}));
