# QuizMaster Frontend

A modern, responsive quiz application built with Next.js, TypeScript, Tailwind CSS, and Zustand for state management.

## Features

- 🎯 **AI-Powered Quiz Generation** - Generate personalized quizzes on any topic
- 🔐 **User Authentication** - Secure sign-up and sign-in with JWT tokens
- 📊 **Interactive Quiz Taking** - Beautiful quiz interface with progress tracking
- 📈 **Detailed Results** - Comprehensive feedback with correct answers
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Modern UI/UX** - Clean, intuitive interface with smooth animations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios
- **Authentication**: JWT with HTTP-only cookies

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running (see server README)

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # User dashboard with quiz generation
│   ├── quiz/             # Quiz taking interface
│   ├── result/[id]/      # Quiz results display
│   ├── signin/           # User sign-in page
│   ├── signup/           # User registration page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── ProtectedRoute.tsx # Authentication wrapper
└── lib/                  # Utility functions and configurations
    ├── api.ts            # API service functions
    └── store.ts          # Zustand state management
```

## API Integration

The frontend integrates with the backend through the following endpoints:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Quiz Management
- `POST /quiz/generate` - Generate new quiz
- `POST /quiz/submit` - Submit quiz answers
- `GET /quiz/result/:id` - Get quiz results
- `GET /quiz/getall` - Get user's quiz history

## Key Components

### Landing Page (`/`)
- Hero section with call-to-action
- Feature highlights
- Navigation to sign-in/sign-up

### Dashboard (`/dashboard`)
- Quiz generation form
- Quiz history display
- User profile information

### Quiz Interface (`/quiz`)
- Interactive question display
- Progress tracking
- Answer selection
- Navigation between questions

### Results (`/result/[id]`)
- Score summary
- Detailed feedback
- Correct answer explanations

## State Management

The application uses Zustand for global state management with two main stores:

### Auth Store
- User authentication state
- JWT token management
- Login/logout functions

### Quiz Store
- Current quiz data
- Quiz history
- Quiz state management

## Styling

The application uses Tailwind CSS for styling with:
- Custom color schemes
- Responsive design patterns
- Smooth transitions and animations
- Consistent spacing and typography

## Authentication Flow

1. User registers or signs in
2. JWT token is stored in localStorage
3. Protected routes check authentication
4. API requests include token in headers
5. Automatic redirect on authentication failure

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file in the client directory:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

For Vercel deployment, set this environment variable in your Vercel dashboard.

## Deployment

The application can be deployed to Vercel, Netlify, or any other hosting platform that supports Next.js.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
