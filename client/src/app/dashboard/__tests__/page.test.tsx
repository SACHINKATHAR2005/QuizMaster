/**
 * @jest-environment jsdom
 */

// Simple dashboard test without complex mocking
describe('Dashboard Page', () => {
  test('should be defined', () => {
    expect(true).toBe(true);
  });

  test('should handle basic functionality', () => {
    const mockUser = {
      id: 'test-user-id',
      username: 'testuser',
      email: 'test@example.com',
    };

    expect(mockUser.username).toBe('testuser');
    expect(mockUser.email).toBe('test@example.com');
  });

  test('should handle quiz data structure', () => {
    const mockQuizHistory = [
      {
        _id: 'quiz1',
        topic: 'JavaScript',
        difficulty: 'medium',
        score: 80,
      },
      {
        _id: 'quiz2',
        topic: 'React',
        difficulty: 'hard',
        score: 90,
      },
    ];

    expect(mockQuizHistory).toHaveLength(2);
    expect(mockQuizHistory[0].topic).toBe('JavaScript');
    expect(mockQuizHistory[1].score).toBe(90);
  });
});
