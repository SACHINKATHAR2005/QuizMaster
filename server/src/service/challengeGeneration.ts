import dotenv from 'dotenv';
dotenv.config();

import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

// Model Configuration - Using openai/gpt-oss-20b
const MODEL_CONFIG = {
  name: "openai/gpt-oss-20b",
  temperature: 0.9,
  max_tokens: 8000,
  top_p: 0.95,
  frequency_penalty: 0.4,
  presence_penalty: 0.5
};

// Helper function to get learning-focused challenges for each technology
const getLearningFocusedChallenges = (technology: string, difficulty: string): string => {
  const challenges = {
    javascript: {
      easy: ["Array methods practice", "Object property access", "Function declarations", "Loop implementations", "String manipulations"],
      medium: ["Array destructuring", "Async/await patterns", "Closure implementations", "Object methods", "Error handling"],
      hard: ["Prototype chains", "Advanced closures", "Performance optimization", "Memory management", "Design patterns"]
    },
    react: {
      easy: ["Component props", "Basic JSX", "Event handlers", "Conditional rendering", "List rendering"],
      medium: ["useState hook", "useEffect patterns", "Custom hooks", "Context usage", "Form handling"],
      hard: ["Performance optimization", "Advanced patterns", "Custom hook libraries", "State management", "Testing strategies"]
    },
    python: {
      easy: ["List operations", "Dictionary usage", "Function definitions", "Loop structures", "String formatting"],
      medium: ["List comprehensions", "Class definitions", "File operations", "Exception handling", "Module imports"],
      hard: ["Decorators", "Generators", "Metaclasses", "Context managers", "Advanced OOP"]
    },
    typescript: {
      easy: ["Basic types", "Interface definitions", "Type annotations", "Optional properties", "Union types"],
      medium: ["Generic functions", "Type guards", "Mapped types", "Conditional types", "Utility types"],
      hard: ["Advanced generics", "Template literal types", "Conditional type inference", "Module augmentation", "Declaration merging"]
    },
    html: {
      easy: ["Semantic elements", "Form inputs", "Link structures", "Image attributes", "List formats"],
      medium: ["Form validation", "Table structures", "Media elements", "Meta tags", "Accessibility features"],
      hard: ["Custom elements", "Web components", "Advanced forms", "SEO optimization", "Performance attributes"]
    },
    css: {
      easy: ["Selectors", "Box model", "Colors and fonts", "Basic layouts", "Positioning"],
      medium: ["Flexbox layouts", "Grid systems", "Animations", "Media queries", "Pseudo-classes"],
      hard: ["Advanced animations", "Custom properties", "Complex layouts", "Performance optimization", "Browser compatibility"]
    }
  };

  const techChallenges = challenges[technology as keyof typeof challenges] || { easy: ["Basic concepts"], medium: ["Intermediate concepts"], hard: ["Advanced concepts"] };
  const levelChallenges = techChallenges[difficulty as keyof typeof techChallenges] || ["General concepts"];
  const randomChallenge = levelChallenges[Math.floor(Math.random() * levelChallenges.length)];
  
  return `Focus Area: ${randomChallenge}
Learning Goal: Test ${technology} knowledge through focused coding exercises
Challenge Type: Single function or code snippet completion`;
};

// Helper functions for generating unique, creative challenges
function getRandomFocusArea(technology: string, difficulty: string): string {
  const focusAreas: Record<string, string[]> = {
    react: [
      'interactive dashboards', 'data visualization', 'form validation', 'real-time updates', 
      'animation effects', 'responsive design', 'state management', 'API integration',
      'user authentication', 'drag and drop', 'infinite scrolling', 'search functionality'
    ],
    javascript: [
      'algorithm optimization', 'data structures', 'async programming', 'DOM manipulation',
      'event handling', 'functional programming', 'object-oriented design', 'error handling',
      'performance optimization', 'browser APIs', 'data processing', 'utility functions'
    ],
    typescript: [
      'type safety', 'generic programming', 'interface design', 'decorator patterns',
      'module systems', 'advanced types', 'error handling', 'API design',
      'configuration management', 'data modeling', 'validation systems', 'utility types'
    ],
    python: [
      'data analysis', 'web scraping', 'automation scripts', 'file processing',
      'API development', 'database operations', 'machine learning basics', 'text processing',
      'image manipulation', 'system administration', 'data structures', 'algorithm implementation'
    ],
    html: [
      'semantic markup', 'accessibility features', 'form design', 'responsive layouts',
      'multimedia integration', 'SEO optimization', 'progressive enhancement', 'component structure',
      'data attributes', 'microdata', 'performance optimization', 'cross-browser compatibility'
    ],
    css: [
      'responsive design', 'animation sequences', 'grid layouts', 'flexbox mastery',
      'custom properties', 'component styling', 'performance optimization', 'accessibility styling',
      'modern selectors', 'transform effects', 'gradient designs', 'typography systems'
    ]
  };
  
  const areas = focusAreas[technology] || focusAreas.javascript;
  return areas[Math.floor(Math.random() * areas.length)];
}

function getRandomRealWorldContext(): string {
  const contexts = [
    'a startup building their MVP',
    'a freelancer creating client solutions',
    'an e-commerce platform enhancement',
    'a social media application feature',
    'a productivity tool for remote teams',
    'a gaming platform component',
    'a healthcare application module',
    'an educational platform feature',
    'a financial dashboard element',
    'a travel booking system part',
    'a food delivery app component',
    'a fitness tracking application',
    'a music streaming platform feature',
    'a news aggregation system',
    'a weather monitoring dashboard',
    'a project management tool',
    'a real estate platform feature',
    'a cryptocurrency tracking app',
    'a recipe sharing platform',
    'a event management system'
  ];
  
  return contexts[Math.floor(Math.random() * contexts.length)];
}

function getUniqueThemes(technology: string, difficulty: string): string {
  const themes: Record<string, Record<string, string[]>> = {
    react: {
      easy: [
        'Build a pet adoption card with favorite toggle',
        'Create a mood tracker with emoji selection',
        'Design a tip calculator with bill splitting',
        'Make a color palette generator',
        'Build a simple habit tracker',
        'Create a random quote display',
        'Design a weather widget mockup',
        'Make a countdown timer for events'
      ],
      medium: [
        'Build a expense tracker with categories',
        'Create a recipe finder with filtering',
        'Design a task scheduler with drag-drop',
        'Make a chat interface with typing indicators',
        'Build a photo gallery with lightbox',
        'Create a music player interface',
        'Design a booking calendar system',
        'Make a real-time collaboration board'
      ],
      hard: [
        'Build a code editor with syntax highlighting',
        'Create a data visualization dashboard',
        'Design a video conference interface',
        'Make a real-time trading platform',
        'Build a collaborative whiteboard',
        'Create a advanced search engine UI',
        'Design a complex form wizard',
        'Make a performance monitoring dashboard'
      ]
    },
    javascript: {
      easy: [
        'Create a password strength validator',
        'Build a simple text encryption tool',
        'Make a unit converter utility',
        'Design a random password generator',
        'Create a word frequency counter',
        'Build a simple calculator with history',
        'Make a color code converter',
        'Design a text formatter utility'
      ],
      medium: [
        'Build a local storage manager',
        'Create a data caching system',
        'Make a URL shortener algorithm',
        'Design a search autocomplete engine',
        'Create a image lazy loading system',
        'Build a event emitter pattern',
        'Make a data validation library',
        'Design a routing system'
      ],
      hard: [
        'Build a virtual DOM implementation',
        'Create a state management library',
        'Make a custom promise implementation',
        'Design a dependency injection system',
        'Create a performance profiler',
        'Build a custom bundler logic',
        'Make a reactive programming system',
        'Design a memory-efficient data structure'
      ]
    }
  };
  
  const techThemes = themes[technology] || themes.javascript;
  const difficultyThemes = techThemes[difficulty] || techThemes.easy;
  
  return difficultyThemes.map(theme => `- ${theme}`).join('\n');
}

export const generateChallenge = async (technology: string, difficulty: string, topic?: string) => {
  try {
    // Add randomization elements to ensure unique challenges every time
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000);
    const creativityBoost = Math.random() > 0.5 ? "innovative" : "practical";
    const focusArea = getLearningFocusedChallenges(technology, difficulty);
    
    const topicText = topic || focusArea;
    
    const prompt = `Generate a focused ${technology} coding challenge for ${difficulty} level that tests specific knowledge and skills.

🎯 CHALLENGE TYPE: Code Snippet Learning Exercise
- Focus on testing ${technology} concepts and syntax
- Single function or small code block challenges
- NO full applications or complex projects
- Test specific language/framework features

📚 LEARNING-FOCUSED APPROACH:
- Test understanding of ${technology} fundamentals
- Practice specific methods, functions, or patterns
- Reinforce key concepts through coding exercises
- Build confidence with targeted practice

🎲 DIFFICULTY LEVELS:
- EASY: Basic syntax, simple functions, fundamental concepts
- MEDIUM: Intermediate features, combining concepts, problem-solving
- HARD: Advanced patterns, optimization, edge cases, complex logic

🔍 TECHNOLOGY-SPECIFIC FOCUS for ${technology}:
${technology === 'javascript' ? 
  `- Functions, arrays, objects, loops, conditionals
   - ${difficulty === 'easy' ? 'Basic syntax and built-in methods' : difficulty === 'medium' ? 'Array methods, object manipulation, async basics' : 'Closures, prototypes, advanced patterns'}` :
technology === 'react' ?
  `- Components, props, state, hooks, JSX
   - ${difficulty === 'easy' ? 'Basic component structure and props' : difficulty === 'medium' ? 'useState, useEffect, event handling' : 'Custom hooks, context, performance optimization'}` :
technology === 'python' ?
  `- Functions, lists, dictionaries, loops, conditionals
   - ${difficulty === 'easy' ? 'Basic syntax and built-in functions' : difficulty === 'medium' ? 'List comprehensions, file handling, classes' : 'Decorators, generators, advanced OOP'}` :
technology === 'typescript' ?
  `- Types, interfaces, generics, type guards
   - ${difficulty === 'easy' ? 'Basic types and interfaces' : difficulty === 'medium' ? 'Union types, generics, type assertions' : 'Advanced types, conditional types, mapped types'}` :
  'General programming concepts'}

Create a SPECIFIC function-based challenge with EXACT requirements:

EXAMPLES:
- "Create validateEmail(email) function that returns true/false for valid email format"
- "Build calculateBMI(weight, height) function that returns BMI category string"
- "Write sortByAge(users) function that sorts array of user objects by age"

JSON Response Format:
{
  "title": "Specific Function Name - ${technology} ${difficulty}",
  "description": "Create function functionName(param1, param2) that does X. Input: specific format. Output: specific format. Example: functionName(input) should return expectedOutput",
  "difficulty": "${difficulty}",
  "technology": "${technology}",
  "starterCode": "function functionName(param1, param2) {\\n  // TODO: implement logic\\n  // return result;\\n}\\n\\n// Test cases:\\nconsole.log(functionName(testInput));",
  "solution": "function functionName(param1, param2) {\\n  // working implementation\\n  return actualResult;\\n}\\n\\n// Test cases:\\nconsole.log(functionName(testInput));",
  "hints": ["Step 1: Check input format", "Step 2: Apply specific logic", "Step 3: Return correct format"]
}

Focus on SPECIFIC, TESTABLE functions with clear input/output!`;


    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL_CONFIG.name,
      temperature: MODEL_CONFIG.temperature,
      max_tokens: MODEL_CONFIG.max_tokens,
      top_p: MODEL_CONFIG.top_p,
      frequency_penalty: MODEL_CONFIG.frequency_penalty,
      presence_penalty: MODEL_CONFIG.presence_penalty
    });

    const content = response.choices[0]?.message?.content;
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


    let challenge;
    try {
      challenge = JSON.parse(cleanedContent);
    } catch (parseError) {
      
      // Try to extract JSON from the response
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          challenge = JSON.parse(jsonMatch[0]);
        } catch (extractError) {
          throw new Error("AI response could not be parsed as JSON even after extraction");
        }
      } else {
        throw new Error("AI response could not be parsed as JSON and no JSON object found");
      }
    }

    // Validate the challenge structure
    const requiredFields = ['title', 'description', 'difficulty', 'technology', 'starterCode', 'solution', 'hints'];
    for (const field of requiredFields) {
      if (!challenge[field]) {
        throw new Error(`Generated challenge is missing required field: ${field}`);
      }
    }

    if (!Array.isArray(challenge.hints) || challenge.hints.length === 0) {
      throw new Error("Challenge must have at least one hint");
    }

    return challenge;

  } catch (error) {
    // Return a fallback challenge based on technology and difficulty
    return getFallbackChallenge(technology, difficulty);
  }
};

function getFallbackChallenge(technology: string, difficulty: string) {
  // Generate randomized fallback challenges to ensure uniqueness
  const timestamp = Date.now();
  const randomIndex = Math.floor(Math.random() * 1000);
  
  const creativeFallbacks: Record<string, Record<string, any[]>> = {
    react: {
      easy: [
        {
          title: `Smart Recipe Card #${randomIndex}`,
          description: `Build a recipe card component that displays a random recipe with ingredients and cooking time. Add a "Cook This!" button that changes to "Cooking..." when clicked and shows a timer. Include a favorite heart icon that toggles red/gray when clicked.`,
          starterCode: `function RecipeCard() {
  // State for cooking status and favorite
  // Random recipe data
  const recipe = {
    name: "Chocolate Chip Cookies",
    time: "25 mins",
    ingredients: ["2 cups flour", "1 cup sugar", "1/2 cup butter"]
  };
  
  return (
    <div className="recipe-card">
      {/* Your component here */}
    </div>
  );
}`,
          solution: `function RecipeCard() {
  const [isCooking, setIsCooking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const recipe = {
    name: "Chocolate Chip Cookies",
    time: "25 mins", 
    ingredients: ["2 cups flour", "1 cup sugar", "1/2 cup butter"]
  };
  
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '300px' }}>
      <h3>{recipe.name}</h3>
      <p>⏱️ {recipe.time}</p>
      <ul>
        {recipe.ingredients.map((ingredient, i) => (
          <li key={i}>{ingredient}</li>
        ))}
      </ul>
      <button 
        onClick={() => setIsCooking(!isCooking)}
        style={{ marginRight: '10px', padding: '8px 16px' }}
      >
        {isCooking ? 'Cooking...' : 'Cook This!'}
      </button>
      <button 
        onClick={() => setIsFavorite(!isFavorite)}
        style={{ background: 'none', border: 'none', fontSize: '20px' }}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
}`,
          hints: [
            "Use useState for both cooking and favorite states",
            "Map over ingredients array to display them",
            "Use conditional rendering for button text and heart emoji"
          ]
        },
        {
          title: `Pet Mood Tracker #${randomIndex}`,
          description: `Create a pet mood tracker that lets users select their pet's current mood from emoji options (😊😴😋🎾). Display the selected mood with a personalized message and track how many times each mood was selected today.`,
          starterCode: `function PetMoodTracker() {
  const moods = [
    { emoji: '😊', name: 'Happy', message: 'Your pet is having a great day!' },
    { emoji: '😴', name: 'Sleepy', message: 'Time for a cozy nap!' },
    { emoji: '😋', name: 'Hungry', message: 'Someone wants treats!' },
    { emoji: '🎾', name: 'Playful', message: 'Ready for some fun!' }
  ];
  
  return (
    <div className="pet-tracker">
      {/* Your component here */}
    </div>
  );
}`,
          solution: `function PetMoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodCounts, setMoodCounts] = useState({});
  
  const moods = [
    { emoji: '😊', name: 'Happy', message: 'Your pet is having a great day!' },
    { emoji: '😴', name: 'Sleepy', message: 'Time for a cozy nap!' },
    { emoji: '😋', name: 'Hungry', message: 'Someone wants treats!' },
    { emoji: '🎾', name: 'Playful', message: 'Ready for some fun!' }
  ];
  
  const selectMood = (mood) => {
    setSelectedMood(mood);
    setMoodCounts(prev => ({
      ...prev,
      [mood.name]: (prev[mood.name] || 0) + 1
    }));
  };
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>🐕 Pet Mood Tracker</h2>
      <div style={{ margin: '20px 0' }}>
        {moods.map(mood => (
          <button
            key={mood.name}
            onClick={() => selectMood(mood)}
            style={{ 
              fontSize: '30px', 
              margin: '5px', 
              padding: '10px',
              border: selectedMood?.name === mood.name ? '3px solid blue' : '1px solid gray'
            }}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      {selectedMood && (
        <div>
          <p style={{ fontSize: '18px', color: 'green' }}>{selectedMood.message}</p>
          <p>Today's mood count: {moodCounts[selectedMood.name] || 0}</p>
        </div>
      )}
    </div>
  );
}`,
          hints: [
            "Use useState for selectedMood and moodCounts object",
            "Create a selectMood function that updates both states",
            "Use conditional rendering to show message when mood is selected"
          ]
        }
      ],
      medium: [
        {
          title: `Smart Shopping List #${randomIndex}`,
          description: `Build a shopping list app that categorizes items automatically (🥕 Produce, 🥛 Dairy, 🍞 Bakery, 🧽 Household). Users can add items, mark them as bought (strikethrough), and see a summary of remaining items per category. Include a "Clear Bought Items" button.`,
          starterCode: `function ShoppingList() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  
  const categories = {
    produce: { icon: '🥕', name: 'Produce' },
    dairy: { icon: '🥛', name: 'Dairy' },
    bakery: { icon: '🍞', name: 'Bakery' },
    household: { icon: '🧽', name: 'Household' }
  };
  
  return (
    <div className="shopping-list">
      {/* Your component here */}
    </div>
  );
}`,
          solution: `function ShoppingList() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  
  const categories = {
    produce: { icon: '🥕', name: 'Produce', keywords: ['apple', 'banana', 'carrot', 'lettuce'] },
    dairy: { icon: '🥛', name: 'Dairy', keywords: ['milk', 'cheese', 'yogurt', 'butter'] },
    bakery: { icon: '🍞', name: 'Bakery', keywords: ['bread', 'bagel', 'muffin', 'cake'] },
    household: { icon: '🧽', name: 'Household', keywords: ['soap', 'detergent', 'paper', 'cleaner'] }
  };
  
  const categorizeItem = (itemName) => {
    const lower = itemName.toLowerCase();
    for (const [key, category] of Object.entries(categories)) {
      if (category.keywords.some(keyword => lower.includes(keyword))) {
        return key;
      }
    }
    return 'household'; // default
  };
  
  const addItem = () => {
    if (newItem.trim()) {
      const item = {
        id: Date.now(),
        name: newItem,
        category: categorizeItem(newItem),
        bought: false
      };
      setItems([...items, item]);
      setNewItem('');
    }
  };
  
  const toggleBought = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, bought: !item.bought } : item
    ));
  };
  
  const clearBought = () => {
    setItems(items.filter(item => !item.bought));
  };
  
  const remainingByCategory = Object.keys(categories).reduce((acc, cat) => {
    acc[cat] = items.filter(item => item.category === cat && !item.bought).length;
    return acc;
  }, {});
  
  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>🛒 Smart Shopping List</h2>
      <div style={{ marginBottom: '20px' }}>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add item..."
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={addItem}>Add</button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        {Object.entries(categories).map(([key, cat]) => (
          <span key={key} style={{ marginRight: '15px' }}>
            {cat.icon} {remainingByCategory[key]}
          </span>
        ))}
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{ 
            padding: '8px', 
            textDecoration: item.bought ? 'line-through' : 'none',
            opacity: item.bought ? 0.5 : 1
          }}>
            <input
              type="checkbox"
              checked={item.bought}
              onChange={() => toggleBought(item.id)}
            />
            {categories[item.category].icon} {item.name}
          </li>
        ))}
      </ul>
      
      <button onClick={clearBought} style={{ marginTop: '10px' }}>
        Clear Bought Items
      </button>
    </div>
  );
}`,
          hints: [
            "Create a categorizeItem function that checks keywords",
            "Use filter and map to manage item states",
            "Calculate remaining items per category using reduce"
          ]
        }
      ]
    },
    javascript: {
      easy: [
        {
          title: `Password Strength Meter #${randomIndex}`,
          description: `Create a password strength checker that evaluates passwords in real-time. Check for: length (8+ chars), uppercase letters, lowercase letters, numbers, and special characters. Display strength as: Weak (red), Medium (orange), Strong (green) with specific feedback.`,
          starterCode: `function checkPasswordStrength(password) {
  // Check various password criteria
  // Return strength level and feedback
  
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\\d/.test(password),
    special: /[!@#$%^&*]/.test(password)
  };
  
  // Your logic here
}

// Test the function
console.log(checkPasswordStrength("password123"));
console.log(checkPasswordStrength("MyStr0ng!Pass"));`,
          solution: `function checkPasswordStrength(password) {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\\d/.test(password),
    special: /[!@#$%^&*]/.test(password)
  };
  
  const score = Object.values(criteria).filter(Boolean).length;
  const feedback = [];
  
  if (!criteria.length) feedback.push("Use at least 8 characters");
  if (!criteria.uppercase) feedback.push("Add uppercase letters");
  if (!criteria.lowercase) feedback.push("Add lowercase letters");
  if (!criteria.numbers) feedback.push("Add numbers");
  if (!criteria.special) feedback.push("Add special characters (!@#$%^&*)");
  
  let strength, color;
  if (score <= 2) {
    strength = "Weak";
    color = "red";
  } else if (score <= 4) {
    strength = "Medium";
    color = "orange";
  } else {
    strength = "Strong";
    color = "green";
  }
  
  return {
    strength,
    color,
    score: \`\${score}/5\`,
    feedback: feedback.length ? feedback : ["Great password!"]
  };
}

// Test the function
console.log(checkPasswordStrength("password123"));
console.log(checkPasswordStrength("MyStr0ng!Pass"));`,
          hints: [
            "Use regular expressions to test for different character types",
            "Count how many criteria are met to determine strength",
            "Build feedback array based on missing criteria"
          ]
        }
      ]
    }
  };
  
  // Get random challenge from available options
  const techChallenges = creativeFallbacks[technology];
  if (techChallenges && techChallenges[difficulty]) {
    const challenges = techChallenges[difficulty];
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    return {
      ...randomChallenge,
      difficulty,
      technology,
      tags: [technology, difficulty, "creative", "interactive", `seed-${randomIndex}`]
    };
  }

  // Ultimate creative fallback
  const contexts = ["gaming", "social", "productivity", "health", "education", "finance"];
  const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
  
  return {
    title: `${randomContext.charAt(0).toUpperCase() + randomContext.slice(1)} ${technology.charAt(0).toUpperCase() + technology.slice(1)} Challenge #${randomIndex}`,
    description: `Build a ${difficulty} level ${technology} component for a ${randomContext} application. Focus on user interaction and modern development practices. Make it unique and engaging!`,
    difficulty,
    technology,
    starterCode: `// ${technology} starter code for ${randomContext} app\n// Challenge #${randomIndex}\n// Your creative solution here`,
    solution: `// ${technology} solution for ${randomContext} app\n// Challenge #${randomIndex}\n// Complete implementation with modern patterns`,
    hints: [
      `This is a ${difficulty} level ${technology} challenge for ${randomContext}`,
      "Focus on user experience and interactivity",
      "Use modern development patterns and best practices",
      "Make it engaging and unique!"
    ],
    tags: [technology, difficulty, randomContext, "creative", `unique-${timestamp}`]
  };
}

export const evaluateUserCode = async (userCode: string, challenge: any, submissionData?: {
  timeSpent: number; // in seconds
  challengeStartTime: number;
  submissionTime: number;
  keystrokes?: number;
  pasteEvents?: number;
}) => {
  try {
    // Calculate timing analysis
    const timingAnalysis = submissionData ? analyzeSubmissionTiming(submissionData, userCode, challenge) : null;
    
    const prompt = `You are an advanced AI code authenticity detector and reviewer. Analyze the user's code for both quality and authenticity.

CHALLENGE:
Title: ${challenge.title}
Description: ${challenge.description}
Technology: ${challenge.technology}
Expected Solution: ${challenge.solution}

USER'S CODE:
${userCode}

${timingAnalysis ? `TIMING DATA:
${timingAnalysis.analysis}
Suspicion Level: ${timingAnalysis.suspicionLevel}
Time Spent: ${submissionData!.timeSpent} seconds
` : ''}

PERFORM COMPREHENSIVE ANALYSIS:

1. **CODE AUTHENTICITY DETECTION** - Analyze for AI-generated patterns:
   - Variable naming patterns (generic vs meaningful names)
   - Code structure and organization
   - Comment style and frequency
   - Error handling patterns
   - Function naming conventions
   - Code complexity vs time spent
   - Typical AI code signatures (perfect formatting, generic names, etc.)

2. **QUALITY ASSESSMENT** - Rate the code quality:
   - Functionality and correctness
   - Code cleanliness and readability
   - Best practices usage
   - Performance considerations

3. **AUTHENTICITY INDICATORS** - Look for:
   - Too perfect/clean for beginner level
   - Generic variable names (data, item, result, etc.)
   - Overly verbose comments
   - Perfect error handling for simple tasks
   - Inconsistent coding style
   - Advanced patterns for basic challenges

Respond in JSON format:
{
  "score": number, // 0-100 functionality score
  "authenticity": {
    "isLikelyAIGenerated": boolean,
    "confidence": number, // 0-100 confidence in AI detection
    "indicators": ["indicator1", "indicator2"],
    "humanLikeFeatures": ["feature1", "feature2"],
    "suspiciousPatterns": ["pattern1", "pattern2"]
  },
  "quality": {
    "codeStyle": number, // 0-100
    "naming": number, // 0-100
    "structure": number, // 0-100
    "complexity": "beginner|intermediate|advanced"
  },
  "timing": {
    "appropriate": boolean,
    "tooFast": boolean,
    "analysis": "timing analysis text"
  },
  "feedback": "detailed feedback about code quality and authenticity",
  "suggestions": ["improvement1", "improvement2", "improvement3"],
  "warning": "warning message if AI-generated suspected, null otherwise"
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL_CONFIG.name,
      temperature: 0.3, // Lower temperature for more consistent analysis
      max_tokens: MODEL_CONFIG.max_tokens,
      top_p: 0.9,
      frequency_penalty: 0.2,
      presence_penalty: 0.2
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    // Clean and parse the JSON response
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/```\n?/, '');
    }

    const evaluation = JSON.parse(cleanedResponse);
    
    // Add timing analysis if available
    if (timingAnalysis) {
      evaluation.timing = {
        ...evaluation.timing,
        ...timingAnalysis
      };
    }
    
    return evaluation;

  } catch (error) {
    
    // Return fallback evaluation with basic authenticity check
    const basicAuthenticityCheck = performBasicAuthenticityCheck(userCode, submissionData);
    
    return {
      score: 75,
      authenticity: basicAuthenticityCheck,
      quality: {
        codeStyle: 70,
        naming: 70,
        structure: 70,
        complexity: "intermediate"
      },
      timing: {
        appropriate: submissionData ? submissionData.timeSpent > 60 : true,
        tooFast: submissionData ? submissionData.timeSpent < 30 : false,
        analysis: "Timing analysis unavailable"
      },
      feedback: "Code evaluation service is currently unavailable. Basic authenticity check performed.",
      suggestions: [
        "Compare your code with the provided solution",
        "Review the hints for guidance",
        "Test your code functionality"
      ],
      warning: basicAuthenticityCheck.isLikelyAIGenerated ? 
        "⚠️ This code shows patterns typical of AI-generated solutions. Please ensure you're writing original code." : null
    };
  }
};

// Helper function to analyze submission timing
function analyzeSubmissionTiming(submissionData: any, userCode: string, challenge: any): any {
  const { timeSpent, challengeStartTime, submissionTime, keystrokes = 0, pasteEvents = 0 } = submissionData;
  const codeLength = userCode.length;
  const linesOfCode = userCode.split('\n').length;
  
  // Calculate expected time based on challenge difficulty and code complexity
  const difficultyMultiplier = {
    'easy': 1,
    'medium': 2,
    'hard': 3
  }[challenge.difficulty as 'easy' | 'medium' | 'hard'] || 1;
  
  const expectedMinTime = Math.max(60, linesOfCode * 10 * difficultyMultiplier); // At least 10 seconds per line
  const expectedMaxTime = linesOfCode * 60 * difficultyMultiplier; // Up to 60 seconds per line
  
  let suspicionLevel = 0;
  const suspiciousFactors = [];
  
  // Time-based analysis
  if (timeSpent < expectedMinTime) {
    suspicionLevel += 40;
    suspiciousFactors.push(`Submitted too quickly (${timeSpent}s vs expected ${expectedMinTime}s minimum)`);
  }
  
  // Keystroke analysis
  if (keystrokes > 0) {
    const keystrokesPerChar = keystrokes / codeLength;
    if (keystrokesPerChar < 1.2) { // Less than 1.2 keystrokes per character suggests copying
      suspicionLevel += 30;
      suspiciousFactors.push('Very low keystroke-to-character ratio suggests copying');
    }
  }
  
  // Paste events analysis
  if (pasteEvents > 2) {
    suspicionLevel += 25;
    suspiciousFactors.push('Multiple paste events detected');
  }
  
  // Immediate submission after challenge generation
  if (timeSpent < 10) {
    suspicionLevel += 50;
    suspiciousFactors.push('Submitted almost immediately after challenge generation');
  }
  
  return {
    suspicionLevel: Math.min(suspicionLevel, 100),
    analysis: `Time spent: ${timeSpent}s, Expected: ${expectedMinTime}-${expectedMaxTime}s, Keystrokes: ${keystrokes}, Paste events: ${pasteEvents}`,
    suspiciousFactors,
    tooFast: timeSpent < expectedMinTime,
    appropriate: timeSpent >= expectedMinTime && timeSpent <= expectedMaxTime
  };
}

// Basic authenticity check for fallback
function performBasicAuthenticityCheck(userCode: string, submissionData?: any): any {
  const indicators = [];
  const suspiciousPatterns = [];
  const humanLikeFeatures = [];
  
  // Check for AI-typical patterns
  const genericVarNames = ['data', 'item', 'result', 'temp', 'val', 'obj', 'arr'];
  const hasGenericNames = genericVarNames.some(name => 
    userCode.includes(`${name}`) || userCode.includes(`${name}[`) || userCode.includes(`${name}.`)
  );
  
  if (hasGenericNames) {
    suspiciousPatterns.push('Generic variable names commonly used by AI');
  }
  
  // Check for perfect formatting
  const lines = userCode.split('\n');
  const perfectlyIndented = lines.every(line => 
    line.trim() === '' || line.match(/^(\s{0,2}|\s{4}|\s{6}|\s{8})/)
  );
  
  if (perfectlyIndented && userCode.length > 100) {
    suspiciousPatterns.push('Perfect indentation throughout');
  }
  
  // Check for human-like features
  if (userCode.includes('//') && !userCode.includes('// ')) {
    humanLikeFeatures.push('Inconsistent comment spacing');
  }
  
  if (userCode.match(/\s+$/m)) {
    humanLikeFeatures.push('Trailing whitespace (human-like)');
  }
  
  // Time-based check
  let timingSuspicious = false;
  if (submissionData && submissionData.timeSpent < 30) {
    timingSuspicious = true;
    suspiciousPatterns.push('Extremely fast submission time');
  }
  
  const isLikelyAIGenerated = suspiciousPatterns.length >= 2 || timingSuspicious;
  const confidence = Math.min(suspiciousPatterns.length * 25 + (timingSuspicious ? 25 : 0), 95);
  
  return {
    isLikelyAIGenerated,
    confidence,
    indicators: [...suspiciousPatterns, ...humanLikeFeatures],
    humanLikeFeatures,
    suspiciousPatterns
  };
}
