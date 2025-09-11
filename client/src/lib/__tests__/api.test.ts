import { quizAPI, codeAPI, authAPI } from '../api';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.create to return the mocked axios instance
mockedAxios.create.mockReturnValue(mockedAxios);

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => 'mock-token');
  });

  describe('Quiz API', () => {
    test('should generate quiz successfully', async () => {
      const mockResponse = {
        data: {
          quizId: '123',
          questions: [
            {
              questionId: 'q1',
              questionText: 'Test question',
              language: 'javascript',
              options: ['A', 'B', 'C', 'D'],
              correctAnswer: 'A'
            }
          ]
        },
        status: 200,
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await quizAPI.generate({
        topic: 'JavaScript',
        difficulty: 'medium',
        includeCodeQuestions: true
      });

      expect(result.data.quizId).toBe('123');
      expect(mockedAxios.post).toHaveBeenCalledWith('/quiz/generate', {
        topic: 'JavaScript',
        difficulty: 'medium',
        includeCodeQuestions: true
      });
    });

    test('should get quiz by ID', async () => {
      const mockResponse = {
        data: { quizId: '123', topic: 'JavaScript' },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await quizAPI.getQuizById('123');

      expect(result.data.quizId).toBe('123');
      expect(mockedAxios.get).toHaveBeenCalledWith('/quiz/123');
    });

    test('should submit quiz answers', async () => {
      const mockResponse = {
        data: { score: 80, correctAnswers: 8 },
        status: 200,
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await quizAPI.submit({
        quizId: '123',
        userAnswers: ['A', 'B', 'C', 'D']
      });

      expect(result.data.score).toBe(80);
      expect(mockedAxios.post).toHaveBeenCalledWith('/quiz/submit', {
        quizId: '123',
        userAnswers: ['A', 'B', 'C', 'D']
      });
    });

    test('should get all quizzes', async () => {
      const mockResponse = {
        data: { quizzes: [{ id: '1' }, { id: '2' }] },
        status: 200,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await quizAPI.getAll();

      expect(result.data.quizzes).toHaveLength(2);
      expect(mockedAxios.get).toHaveBeenCalledWith('/quiz/getall');
    });

    test('should handle quiz generation error', async () => {
      const mockError = new Error('Generation failed');
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(quizAPI.generate({
        topic: 'JavaScript',
        difficulty: 'medium'
      })).rejects.toThrow('Generation failed');
    });
  });

  describe('Code API', () => {
    test('should execute code successfully', async () => {
      const mockResponse = {
        data: {
          output: 'Hello World',
          success: true,
          language: 'javascript'
        },
        status: 200,
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await codeAPI.execute({
        code: 'console.log("Hello World");',
        language: 'javascript'
      });

      expect(result.data.output).toBe('Hello World');
      expect(result.data.success).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledWith('/code/execute', {
        code: 'console.log("Hello World");',
        language: 'javascript'
      });
    });

    test('should handle code execution error', async () => {
      const mockError = new Error('Execution failed');
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(codeAPI.execute({
        code: 'invalid code',
        language: 'javascript'
      })).rejects.toThrow('Execution failed');
    });
  });

  describe('Auth API', () => {
    test('should register user successfully', async () => {
      const mockResponse = {
        data: { message: 'User registered', token: 'jwt-token' },
        status: 201,
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await authAPI.register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result.data.message).toBe('User registered');
      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    test('should login user successfully', async () => {
      const mockResponse = {
        data: { message: 'Login successful', token: 'jwt-token' },
        status: 200,
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await authAPI.login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result.data.message).toBe('Login successful');
      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
    });

    test('should handle login error', async () => {
      const mockError = new Error('Invalid credentials');
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(authAPI.login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow('Invalid credentials');
    });
  });
});
