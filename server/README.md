# QuizMaster Backend

A robust Node.js/Express backend for the QuizMaster application with TypeScript, MongoDB, and AI-powered quiz generation.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 🤖 **AI Quiz Generation** - Powered by Groq SDK
- 📊 **Quiz Management** - Create, submit, and track quiz results
- 💾 **File Operations** - Save and manage code files
- 🏆 **Challenge System** - Coding challenges with multiple difficulties
- 🔧 **Code Execution** - Execute JavaScript and Python code safely

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **AI**: Groq SDK for quiz generation
- **Testing**: Jest with Supertest

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/quizmaster
JWT_SECRET=your-jwt-secret
GROQ_API_KEY=your-groq-api-key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Start development server:
```bash
npm run dev
```

## Environment Variables

### Required Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `GROQ_API_KEY` - API key for Groq AI service

### Optional Variables

- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (production)

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Quiz Management
- `POST /quiz/generate` - Generate AI quiz
- `GET /quiz/:id` - Get quiz by ID
- `POST /quiz/submit` - Submit quiz answers
- `GET /quiz/result/:id` - Get quiz results
- `GET /quiz/getall` - Get user's quiz history

### Code Execution
- `POST /code/execute` - Execute code (JS/Python)

### File Management
- `POST /file/save` - Save code file
- `GET /file/load/:filename` - Load code file
- `GET /file/list` - List user files
- `DELETE /file/delete/:filename` - Delete file

### Challenges
- `GET /challenges` - Get coding challenges
- `GET /challenges/:id` - Get specific challenge
- `POST /challenges` - Create new challenge
- `POST /challenges/generate` - Generate AI challenge

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Deployment

### Render Deployment

1. Connect your GitHub repository to Render
2. Set the root directory to `server`
3. Configure environment variables in Render dashboard
4. Deploy using the included `render.yaml` configuration

### Environment Variables for Production

Set these in your Render dashboard:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Strong secret key
- `GROQ_API_KEY` - Your Groq API key
- `FRONTEND_URL` - Your Vercel frontend URL
- `NODE_ENV` - Set to `production`

## Project Structure

```
src/
├── Db/                 # Database connection
├── controllers/        # Route controllers
├── middlewares/        # Express middlewares
├── models/            # Mongoose models
├── routes/            # API routes
├── scripts/           # Utility scripts
├── service/           # Business logic services
├── types/             # TypeScript type definitions
└── app.ts            # Main application file
```

## Testing

Run the test suite:
```bash
npm test
```

Tests include:
- Unit tests for controllers
- Integration tests for API endpoints
- Database operation tests
- Authentication flow tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.
