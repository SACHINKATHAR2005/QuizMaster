import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeCode = async (code: string, language: string): Promise<string> => {
  try {
    const prompt = `You are a code execution analyzer. Analyze this ${language} code and provide ONLY the execution output or errors.

Rules:
- For Python: Show actual print() outputs, variable values, function returns
- For JavaScript: Show console.log outputs, return values, variable states
- For TypeScript: Same as JavaScript but with type information
- For React: Show component structure and props/state analysis
- NO suggestions, NO improvements, NO explanations
- ONLY show what the code would output when executed
- If there are errors, show the exact error message
- Format output like a real terminal/console

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Provide ONLY the execution output:`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-20b',
      temperature: 0.1,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'No output generated';
  } catch (error) {
    console.error('AI analysis error:', error);
    return `❌ Error analyzing code: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

export const generateUniqueChallenge = async (language: string, difficulty: string): Promise<any> => {
  try {
    const timestamp = Date.now();
    const contexts = [
      'e-commerce platform', 'social media app', 'banking system', 'gaming platform',
      'healthcare app', 'education portal', 'food delivery', 'travel booking',
      'fitness tracker', 'music streaming', 'video platform', 'chat application'
    ];
    
    const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
    
    const prompt = `Create a unique ${difficulty} ${language} coding challenge for a ${randomContext} context.

Requirements:
- Completely unique challenge (timestamp: ${timestamp})
- Real-world scenario from ${randomContext}
- Specific function name and parameters
- Clear input/output examples
- Working starter code
- Complete solution
- 3 helpful hints

Format as JSON:
{
  "title": "Challenge Title",
  "description": "Detailed description with context",
  "starterCode": "Working starter code",
  "solution": "Complete working solution",
  "hints": ["hint1", "hint2", "hint3"],
  "technology": "${language}",
  "difficulty": "${difficulty}"
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-20b',
      temperature: 0.9,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from AI');

    return JSON.parse(response);
  } catch (error) {
    console.error('Challenge generation error:', error);
    // Return fallback challenge
    return {
      title: `${language} ${difficulty} Challenge`,
      description: `Solve this ${difficulty} ${language} problem`,
      starterCode: `// Write your ${language} code here`,
      solution: `// Solution for ${language}`,
      hints: ['Think step by step', 'Check the requirements', 'Test your code'],
      technology: language,
      difficulty: difficulty
    };
  }
};
