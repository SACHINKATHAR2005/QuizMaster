import dotenv from 'dotenv';
dotenv.config();

import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export const generateQuiz = async (topic: string, difficulty: string, includeCodeQuestions: boolean = false) => {
  try {
    // Add randomization to ensure unique questions every time
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000);
    
    const prompt = `You are a coding interview quiz generator. Create **10 UNIQUE coding questions** for "${topic}" with "${difficulty}" difficulty.

🎲 UNIQUENESS REQUIREMENT (Timestamp: ${timestamp}, Seed: ${randomSeed}):
- Questions must be DIFFERENT on every generation
- Use varied code snippets, different variable names, unique scenarios
- Never repeat the same logic patterns or examples
- Create fresh, original problems each time

⚡ STRICT RULES:
- Only **programming/code-focused questions** (NO theory, NO history)
- Keep them **short, precise, and practical**
- Each question must require the user to either:
  • Debug a code snippet (find errors)
  • Predict the output of a given snippet  
  • Fix logic issues in a function
  • Implement a small feature (arrays, conditions, loops, functions, classes)

🎯 DIFFICULTY  🎯 LANGUAGE-SPECIFIC EXAMPLES:
  - **JavaScript**: Array methods, async/await, closures, DOM manipulation (language: "javascript")
  - **TypeScript**: Type definitions, interfaces, generics, type guards (language: "typescript")
  - **Python**: List comprehensions, decorators, lambda functions, error handling (language: "python")
  - **React**: Component lifecycle, hooks, state management, props (language: "javascript")

  📋 REQUIRED JSON FORMAT (return ONLY this, no markdown):
  [
    {
      "questionId": "q1_${randomSeed}",
      "questionText": "What will be the output of the following code?",
      "codeSnippet": "console.log([1,2,3].map(x => x * 2));",
      "language": "javascript",
      "options": ["[1,2,3]", "[2,4,6]", "[3,6,9]", "Error"],
      "correctAnswer": "[2,4,6]"
    }
  ]

🔥 EXAMPLES FOR ${difficulty.toUpperCase()} ${topic.toUpperCase()}:

${difficulty === 'easy' ? `
EASY Examples:
- "What does this code output: console.log(typeof null);"
- "Find the error: let arr = [1,2,3]; arr.push(4,5); console.log(arr.length());"
- "What will x be: let x = 5; x += 3; x *= 2;"
- "Debug this function: function sum(a,b) { return a + b + c; }"
` : difficulty === 'medium' ? `
MEDIUM Examples:
- "What's wrong with: const obj = {a:1}; obj.b.c = 2;"
- "Find all bugs: function getData() { return fetch('/api').then(res => res.json).catch(err => console.log(err) }"
- "What outputs: [1,2,3].forEach((item, i) => { setTimeout(() => console.log(i), 100); });"
- "Debug: const users = [{name:'John'}]; users.map(u => u.age.toString());"
` : `
HARD Examples:
- "Fix this closure issue: for(var i=0; i<3; i++) { setTimeout(() => console.log(i), 100); }"
- "Debug async/await: async function test() { const data = await fetch('/api'); return data.json; }"
- "Find the memory leak: function createHandler() { const data = new Array(1000000); return () => console.log(data.length); }"
- "Fix recursion: function factorial(n) { return n * factorial(n-1); }"
`}

🚀 GENERATE 10 UNIQUE QUESTIONS NOW - Make each one completely different from previous generations!`;


    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-20b",
      temperature: 0.7,
      max_tokens: 8000,
      top_p: 0.95,
      frequency_penalty: 0.3,
      presence_penalty: 0.4
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content returned from Groq API.");
    }


    // Clean the response content
    let cleanedContent = content.trim();
    
    // Remove any markdown formatting if present
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/```json\n?/, '').replace(/```\n?/, '');
    }
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/```\n?/, '').replace(/```\n?/, '');
    }


    let questions;
    try {
      questions = JSON.parse(cleanedContent);
    } catch (parseError) {
      
      // Try to fix incomplete JSON by finding the last complete question
      let fixedContent = cleanedContent;
      
      // If JSON is incomplete, try to close it properly
      if (cleanedContent.includes('"questionId":') && !cleanedContent.trim().endsWith(']')) {
        // Find the last complete question object
        const questionMatches = [...cleanedContent.matchAll(/"questionId":\s*"[^"]*"/g)];
        if (questionMatches.length > 0) {
          const lastQuestionStart = questionMatches[questionMatches.length - 1].index;
          const beforeLastQuestion = cleanedContent.substring(0, lastQuestionStart);
          
          // Check if we have at least 5 complete questions
          const completeQuestions = [...beforeLastQuestion.matchAll(/\{[^}]*"questionId"[^}]*\}/g)];
          if (completeQuestions.length >= 5) {
            // Take only complete questions and close the array
            const lastCompleteEnd = completeQuestions[completeQuestions.length - 1].index + completeQuestions[completeQuestions.length - 1][0].length;
            fixedContent = beforeLastQuestion.substring(0, lastCompleteEnd) + ']';
          }
        }
      }
      
      try {
        questions = JSON.parse(fixedContent);
      } catch (fixError) {
        throw new Error("AI response could not be parsed as JSON even after fixing");
      }
    }

    // Validate the questions structure
    if (!Array.isArray(questions)) {
      throw new Error("AI response is not an array");
    }

    if (questions.length === 0) {
      throw new Error("AI response contains no questions");
    }

    // Ensure we have at least 5 questions, pad with fallback if needed
    if (questions.length < 5) {
      const fallbackSeed = Math.floor(Math.random() * 1000);
      const fallbackQuestions = [
        {
          questionId: `fallback_q${questions.length + 1}_${fallbackSeed}`,
          questionText: "What will this code output?",
          codeSnippet: "console.log(typeof null);",
          options: ["null", "object", "undefined", "string"],
          correctAnswer: "object"
        },
        {
          questionId: `fallback_q${questions.length + 2}_${fallbackSeed}`,
          questionText: "Find the error in this code:",
          codeSnippet: "const arr = [1,2,3]; console.log(arr.length());",
          options: ["No error", "length() should be length", "Missing semicolon", "Wrong syntax"],
          correctAnswer: "length() should be length"
        }
      ];
      
      // Add fallback questions until we have at least 10
      while (questions.length < 10 && fallbackQuestions.length > 0) {
        questions.push(fallbackQuestions.shift());
      }
    }

    // Validate each question has required fields
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.questionId || !question.questionText || !question.options || !question.correctAnswer) {
        throw new Error(`Question ${i + 1} is missing required fields (questionId, questionText, options, correctAnswer)`);
      }
      if (!Array.isArray(question.options) || question.options.length !== 4) {
        throw new Error(`Question ${i + 1} must have exactly 4 options`);
      }
      if (!question.options.includes(question.correctAnswer)) {
        throw new Error(`Question ${i + 1} correct answer must be one of the options`);
      }
    }

    return questions;

  } catch (error) {
    // Return a fallback quiz if AI fails - with 10 actual coding questions in new format
    const fallbackSeed = Math.floor(Math.random() * 1000);
    return [
      {
        questionId: `fallback_q1_${fallbackSeed}`,
        questionText: "What will this code output?",
        codeSnippet: "console.log(2 + '2')",
        options: ["4", "22", "NaN", "Error"],
        correctAnswer: "22"
      },
      {
        questionId: `fallback_q2_${fallbackSeed}`,
        questionText: "Find the error in this code:",
        codeSnippet: "let arr = [1,2,3]; arr.push(4,5); console.log(arr.length());",
        options: ["No error", "length() should be length", "push() is wrong", "Syntax error"],
        correctAnswer: "length() should be length"
      },
      {
        questionId: `fallback_q3_${fallbackSeed}`,
        questionText: "What will this function call return?",
        codeSnippet: "function add(a, b) { return a + b; } add(2);",
        options: ["2", "NaN", "undefined", "Error"],
        correctAnswer: "NaN"
      },
      {
        questionId: `fallback_q4_${fallbackSeed}`,
        questionText: "What will this output?",
        codeSnippet: "const arr = [1,2,3]; console.log(arr[3]);",
        options: ["3", "undefined", "Error", "null"],
        correctAnswer: "undefined"
      },
      {
        questionId: `fallback_q5_${fallbackSeed}`,
        questionText: "Which is the correct way to check if a variable is an array?",
        codeSnippet: "let arr = [1,2,3];",
        options: ["typeof arr === 'array'", "arr.isArray()", "Array.isArray(arr)", "arr instanceof Object"],
        correctAnswer: "Array.isArray(arr)"
      },
      {
        questionId: `fallback_q6_${fallbackSeed}`,
        questionText: "What will this loop output?",
        codeSnippet: "for(let i = 0; i < 3; i++) { setTimeout(() => console.log(i), 100); }",
        options: ["0,1,2", "3,3,3", "undefined", "Error"],
        correctAnswer: "0,1,2"
      },
      {
        questionId: `fallback_q7_${fallbackSeed}`,
        questionText: "What does this function return?",
        codeSnippet: "function test() { return; 42; }",
        options: ["42", "undefined", "null", "Error"],
        correctAnswer: "undefined"
      },
      {
        questionId: `fallback_q8_${fallbackSeed}`,
        questionText: "Find the error in this code:",
        codeSnippet: "const obj = { name: 'John' }; console.log(obj.age.toString());",
        options: ["No error", "Cannot read property 'toString' of undefined", "Syntax error", "Type error"],
        correctAnswer: "Cannot read property 'toString' of undefined"
      },
      {
        questionId: `fallback_q9_${fallbackSeed}`,
        questionText: "What will this output?",
        codeSnippet: "console.log(typeof NaN);",
        options: ["NaN", "undefined", "number", "object"],
        correctAnswer: "number"
      },
      {
        questionId: `fallback_q10_${fallbackSeed}`,
        questionText: "What's wrong with this condition?",
        codeSnippet: "if (x = 5) { console.log('true'); }",
        options: ["Nothing", "Should use == instead of =", "Should use === instead of =", "Assignment instead of comparison"],
        correctAnswer: "Assignment instead of comparison"
      }
    ];
  }
};
