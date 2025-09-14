import axios from 'axios';

const API_BASE_URL = 'https://quizmaster-backend-production.up.railway.app';
// 4000

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: async (data: { username: string; email: string; password: string }) => {
    try {
      const response = await api.post('/auth/register', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  login: async (data: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Quiz APIs
export const quizAPI = {
  // Generate new quiz
  generate: async (data: { topic: string; difficulty: string; includeCodeQuestions?: boolean }) => {
    try {
      const response = await api.post('/quiz/generate', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Get quiz by ID
  getQuizById: async (quizId: string) => {
    try {
      const response = await api.get(`/quiz/${quizId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Submit quiz answers
  submit: async (data: { quizId: string; userAnswers: string[] }) => {
    try {
      const response = await api.post('/quiz/submit', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Get quiz results
  getResult: async (id: string) => {
    try {
      const response = await api.get(`/quiz/result/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Get all quiz data
  getAll: async () => {
    try {
      const response = await api.get('/quiz/getall');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Code APIs
export const codeAPI = {
  execute: async (data: { code: string; language: string }) => {
    try {
      const response = await api.post('/code/execute', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// File APIs
export const fileAPI = {
  save: (data: { fileName: string; language: string; code: string }) =>
    api.post('/file/save', data),
  
  load: (fileName: string) =>
    api.get(`/file/load/${fileName}`),
  
  list: () =>
    api.get('/file/list'),
  
  delete: (fileName: string) =>
    api.delete(`/file/delete/${fileName}`)
};

export const challengeAPI = {
  getChallenges: (params?: { technology?: string; difficulty?: string; page?: number; limit?: number }) =>
    api.get('/challenges', { params }),
  
  getChallenge: (id: string) =>
    api.get(`/challenges/${id}`),
  
  createChallenge: (data: any) =>
    api.post('/challenges', data),
  
  generateAI: (data: { technology: string; difficulty: string; topic?: string }) =>
    api.post('/challenges/generate', data)
};

export default api;
