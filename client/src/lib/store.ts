import { create } from 'zustand';

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
  generatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

interface QuizState {
  currentQuiz: Quiz | null;
  quizHistory: Quiz[];
  setCurrentQuiz: (quiz: Quiz) => void;
  setQuizHistory: (quizzes: Quiz[]) => void;
  clearCurrentQuiz: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user: User, token: string) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export const useQuizStore = create<QuizState>((set) => ({
  currentQuiz: null,
  quizHistory: [],
  setCurrentQuiz: (quiz: Quiz) => set({ currentQuiz: quiz }),
  setQuizHistory: (quizzes: Quiz[]) => set({ quizHistory: quizzes }),
  clearCurrentQuiz: () => set({ currentQuiz: null }),
}));
