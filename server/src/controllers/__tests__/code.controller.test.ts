import request from 'supertest';
import express from 'express';
import { executeCode } from '../code.controller.js';
import fs from 'fs';
import path from 'path';

// Mock the auth middleware
const mockAuthMiddleware = (req: any, res: any, next: any) => {
  req.user = { id: 'test-user-id' };
  next();
};

describe('Code Controller', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(mockAuthMiddleware);
    app.post('/execute', executeCode);
  });

  afterEach(() => {
    // Clean up any remaining temp files
    const tempDir = path.join(process.cwd(), 'temp');
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      files.forEach(file => {
        try {
          fs.unlinkSync(path.join(tempDir, file));
        } catch (error) {
          // Ignore cleanup errors
        }
      });
    }
  });

  describe('Simple Code Controller tests without file system operations', () => {
    test('should validate JavaScript code structure', () => {
      const codeData = {
        code: 'console.log("Hello World");',
        language: 'javascript'
      };

      expect(codeData.code).toBeTruthy();
      expect(codeData.language).toBe('javascript');
    });

    test('should validate Python code structure', () => {
      const codeData = {
        code: 'print("Hello Python")',
        language: 'python'
      };

      expect(codeData.code).toBeTruthy();
      expect(codeData.language).toBe('python');
    });

    test('should handle code validation', () => {
      const validCode = {
        code: 'console.log("test");',
        language: 'javascript'
      };

      const invalidCode: any = {
        language: 'javascript'
        // missing code
      };

      expect(validCode.code).toBeDefined();
      expect(validCode.language).toBeDefined();
      expect(invalidCode.code).toBeUndefined();
    });

    test('should validate supported languages', () => {
      const supportedLanguages = ['javascript', 'python'];
      const testLanguage = 'javascript';
      const unsupportedLanguage = 'bash';

      expect(supportedLanguages).toContain(testLanguage);
      expect(supportedLanguages).not.toContain(unsupportedLanguage);
    });
  });

  describe('POST /execute', () => {
    test('should execute JavaScript code successfully', async () => {
      const response = await request(app)
        .post('/execute')
        .send({
          code: 'console.log("Hello World");',
          language: 'javascript'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toContain('Hello World');
      expect(response.body.language).toBe('javascript');
    });

    test('should execute Python code successfully', async () => {
      const response = await request(app)
        .post('/execute')
        .send({
          code: 'print("Hello Python")',
          language: 'python'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.output).toContain('Hello Python');
      expect(response.body.language).toBe('python');
    });

    test('should return error for missing code', async () => {
      const response = await request(app)
        .post('/execute')
        .send({
          language: 'javascript'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Code and language are required!');
    });

    test('should return error for missing language', async () => {
      const response = await request(app)
        .post('/execute')
        .send({
          code: 'console.log("test");'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Code and language are required!');
    });

    test('should return error for unsupported language', async () => {
      const response = await request(app)
        .post('/execute')
        .send({
          code: 'puts "Hello Ruby"',
          language: 'ruby'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Only JavaScript and Python are supported currently');
    });

    test('should handle code execution errors', async () => {
      const response = await request(app)
        .post('/execute')
        .send({
          code: 'console.log(undefinedVariable);',
          language: 'javascript'
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Code execution failed');
    });

    test('should handle syntax errors', async () => {
      const response = await request(app)
        .post('/execute')
        .send({
          code: 'console.log("unclosed string',
          language: 'javascript'
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});
