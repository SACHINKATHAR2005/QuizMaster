# Testing Guide

This guide provides comprehensive instructions for testing the AI-Powered Quiz & Challenge Platform.

## 🧪 Testing Framework Overview

We use **Jest** as our primary testing framework for both backend and frontend testing, with additional libraries for specific testing needs.

## 📋 Prerequisites

### Backend Testing Dependencies
```bash
cd server
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest mongodb-memory-server
```

### Frontend Testing Dependencies
```bash
cd client
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

## 🚀 Running Tests

### Backend Tests
```bash
cd server
npm test                    # Run all tests once
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
```

### Frontend Tests
```bash
cd client
npm test                    # Run all tests once
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
```

### Run Specific Test Files
```bash
# Backend
npm test code.controller.test.ts
npm test quiz.model.test.ts

# Frontend
npm test dashboard/page.test.tsx
npm test api.test.ts
```

## 📁 Test Structure

### Backend Test Organization
```
server/src/
├── controllers/__tests__/
│   ├── code.controller.test.ts
│   └── quiz.controller.test.ts
├── models/__tests__/
│   ├── quiz.model.test.ts
│   └── user.model.test.ts
├── services/__tests__/
│   ├── quizGeneration.test.ts
│   └── codeAnalysis.test.ts
├── routes/__tests__/
│   ├── code.router.test.ts
│   └── quiz.router.test.ts
└── setupTests.ts
```

### Frontend Test Organization
```
client/src/
├── app/
│   ├── dashboard/__tests__/
│   │   └── page.test.tsx
│   ├── quiz/__tests__/
│   │   └── page.test.tsx
│   └── code-ide/__tests__/
│       └── page.test.tsx
├── components/__tests__/
│   ├── ProtectedRoute.test.tsx
│   └── CodeEditor.test.tsx
├── lib/__tests__/
│   ├── api.test.ts
│   └── store.test.ts
└── jest.setup.js
```

## 🧪 Test Types & Examples

### 1. Unit Tests

**Backend Controller Test Example:**
```typescript
// src/controllers/__tests__/code.controller.test.ts
import request from 'supertest';
import express from 'express';
import { executeCode } from '../code.controller';

describe('Code Controller', () => {
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
  });
});
```

**Frontend Component Test Example:**
```typescript
// src/app/dashboard/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react';
import Dashboard from '../page';

describe('Dashboard', () => {
  test('renders dashboard with user greeting', async () => {
    render(<Dashboard />);
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });
});
```

### 2. Integration Tests

**API Integration Test:**
```typescript
// src/routes/__tests__/quiz.router.test.ts
describe('Quiz Router Integration', () => {
  test('should generate quiz and store in database', async () => {
    const response = await request(app)
      .post('/quiz/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        topic: 'JavaScript',
        difficulty: 'medium'
      });

    expect(response.status).toBe(201);
    
    // Verify database storage
    const quiz = await Quiz.findById(response.body.quizId);
    expect(quiz).toBeTruthy();
    expect(quiz.topic).toBe('JavaScript');
  });
});
```

### 3. Database Tests

**Model Validation Test:**
```typescript
// src/models/__tests__/quiz.model.test.ts
describe('Quiz Model', () => {
  test('should validate required fields', async () => {
    const invalidQuiz = new Quiz({});
    
    await expect(invalidQuiz.save()).rejects.toThrow();
  });

  test('should save valid quiz data', async () => {
    const validQuiz = new Quiz({
      userId: new mongoose.Types.ObjectId(),
      topic: 'JavaScript',
      difficulty: 'medium',
      questions: [/* valid questions */]
    });

    const savedQuiz = await validQuiz.save();
    expect(savedQuiz._id).toBeDefined();
  });
});
```

### 4. Service Tests

**AI Service Mock Test:**
```typescript
// src/services/__tests__/quizGeneration.test.ts
jest.mock('groq-sdk');

describe('Quiz Generation Service', () => {
  test('should generate quiz with AI response', async () => {
    mockGroq.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockQuestions) } }]
    });

    const result = await generateQuiz('JavaScript', 'medium');
    expect(result).toHaveLength(10);
  });

  test('should fallback when AI fails', async () => {
    mockGroq.chat.completions.create.mockRejectedValue(new Error('AI Error'));

    const result = await generateQuiz('JavaScript', 'medium');
    expect(result).toHaveLength(10); // Fallback questions
  });
});
```

## 🎯 Testing Best Practices

### 1. Test Isolation
- Each test should be independent
- Use `beforeEach` and `afterEach` for setup/cleanup
- Mock external dependencies

### 2. Descriptive Test Names
```typescript
// Good
test('should return 400 when code parameter is missing')

// Bad
test('code validation')
```

### 3. Arrange-Act-Assert Pattern
```typescript
test('should calculate quiz score correctly', () => {
  // Arrange
  const correctAnswers = 8;
  const totalQuestions = 10;

  // Act
  const score = calculateScore(correctAnswers, totalQuestions);

  // Assert
  expect(score).toBe(80);
});
```

### 4. Mock External Dependencies
```typescript
// Mock API calls
jest.mock('../api', () => ({
  quizAPI: {
    generate: jest.fn().mockResolvedValue({ data: mockQuiz })
  }
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  }
});
```

## 📊 Coverage Requirements

### Target Coverage Metrics
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### Generate Coverage Reports
```bash
# Backend
cd server && npm run test:coverage

# Frontend
cd client && npm run test:coverage
```

### View Coverage Reports
- Open `coverage/lcov-report/index.html` in browser
- Review uncovered lines and branches
- Add tests for critical uncovered code

## 🔧 Configuration Files

### Jest Configuration (Backend)
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
```

### Jest Configuration (Frontend)
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
```

## 🐛 Debugging Tests

### Common Issues & Solutions

1. **Module Import Errors**
   ```bash
   # Add .js extension for ES modules
   import Quiz from '../quiz.model.js';
   ```

2. **Async Test Timeouts**
   ```typescript
   // Increase timeout for slow tests
   test('slow operation', async () => {
     // test code
   }, 10000); // 10 second timeout
   ```

3. **Mock Not Working**
   ```typescript
   // Ensure mocks are hoisted
   jest.mock('../module', () => ({
     default: jest.fn(),
   }));
   ```

### Debug Commands
```bash
# Run tests with verbose output
npm test -- --verbose

# Run single test file
npm test -- quiz.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should execute code"
```

## 📈 Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install Backend Dependencies
        run: cd server && npm ci
      
      - name: Run Backend Tests
        run: cd server && npm test
      
      - name: Install Frontend Dependencies
        run: cd client && npm ci
      
      - name: Run Frontend Tests
        run: cd client && npm test
```

## 🎯 Testing Checklist

### Before Committing
- [ ] All tests pass locally
- [ ] New features have corresponding tests
- [ ] Coverage meets minimum requirements
- [ ] No console errors in test output
- [ ] Tests are properly organized and named

### Code Review
- [ ] Tests cover edge cases
- [ ] Mocks are appropriate and minimal
- [ ] Test data is realistic
- [ ] Tests are maintainable and readable

This testing guide ensures comprehensive coverage and maintainable test suites for the entire platform.
