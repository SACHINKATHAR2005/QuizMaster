# AI-Powered Quiz & Challenge Platform

A comprehensive full-stack application for generating AI-powered coding quizzes and challenges with real-time code execution and testing capabilities.

## 🚀 Features

- **AI-Powered Quiz Generation**: Dynamic quiz creation using Groq AI
- **Multi-Language Support**: JavaScript, TypeScript, Python, React
- **Real-Time Code Execution**: Safe code execution with timeout protection
- **Interactive Code IDE**: Monaco Editor with syntax highlighting
- **Dark Mode**: Default dark theme with user preference persistence
- **Personalized Experience**: User-specific quizzes and challenges
- **Comprehensive Testing**: Full test coverage with Jest

## 🏗️ Architecture

### Backend (Express.js + TypeScript)
- **Authentication**: JWT-based auth with middleware protection
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Groq SDK for quiz generation
- **Code Execution**: Secure sandboxed execution environment
- **Testing**: Jest with MongoDB Memory Server

### Frontend (Next.js + React)
- **State Management**: Zustand for global state
- **Styling**: Tailwind CSS with dark mode support
- **Code Editor**: Monaco Editor integration
- **API Client**: Axios with interceptors
- **Testing**: React Testing Library + Jest

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB
- Python (for code execution)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env  # Configure environment variables
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 🧪 Testing

### Run Backend Tests
```bash
cd server
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Run Frontend Tests
```bash
cd client
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/quiz-platform
JWT_SECRET=your-jwt-secret
GROQ_API_KEY=your-groq-api-key
PORT=4000
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Quiz Management
- `POST /quiz/generate` - Generate AI quiz
- `GET /quiz/:id` - Get quiz by ID
- `POST /quiz/submit` - Submit quiz answers
- `GET /quiz/getall` - Get user's quiz history

### Code Execution
- `POST /code/execute` - Execute code safely

### Challenges
- `GET /challenges` - Get challenges
- `POST /challenges/generate` - Generate AI challenge

## 🧪 Test Coverage

### Backend Tests
- **Controllers**: API endpoint testing with supertest
- **Models**: Database schema validation
- **Services**: AI service mocking and fallback testing
- **Integration**: End-to-end API testing

### Frontend Tests
- **Components**: React component rendering
- **Pages**: Full page functionality
- **API**: HTTP client testing with mocks
- **Stores**: State management testing

## 🔒 Security Features

- JWT authentication with secure middleware
- Input validation and sanitization
- Code execution timeout protection
- User-specific data isolation
- CORS configuration for frontend access

## 🎨 UI/UX Features

- Modern gradient backgrounds
- Responsive design for all devices
- Dark mode as default with persistence
- Interactive code editor with syntax highlighting
- Real-time React component preview
- Loading states and error handling

## 🚀 Deployment

### Backend
```bash
npm run build
npm start
```

### Frontend
```bash
npm run build
npm start
```

## 📈 Performance Optimizations

- Code execution with 5-second timeout
- Efficient database queries with user filtering
- Lazy loading for code editor components
- Optimized bundle size with Next.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Technologies Used

- **Backend**: Express.js, TypeScript, MongoDB, Mongoose, Groq AI
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Zustand
- **Testing**: Jest, React Testing Library, Supertest
- **Code Editor**: Monaco Editor
- **Authentication**: JWT
- **Deployment**: Node.js, MongoDB Atlas
