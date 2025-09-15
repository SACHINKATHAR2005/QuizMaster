# QuizMaster Deployment Guide

## Overview
This guide covers deploying the QuizMaster application to Vercel with enhanced global state management using Zustand.

## Global State Management Implementation

### ✅ Completed Features

1. **Enhanced Zustand Stores**
   - `useAuthStore`: Authentication state with persistence
   - `useQuizStore`: Quiz management with history tracking
   - `useAppStore`: App-wide settings (dark mode, notifications)
   - `useChallengeStore`: Challenge management
   - All stores include loading states and error handling

2. **Notification System**
   - Real-time toast notifications
   - Auto-dismiss after 5 seconds
   - Success, error, warning, and info types
   - Integrated throughout the application

3. **Persistent State**
   - Authentication tokens persist across sessions
   - Quiz history saved locally
   - Dark mode preference remembered
   - Sidebar state persistence

## Vercel Deployment Configuration

### Fixed Issues:
- ✅ Empty `vercel.json` configuration
- ✅ Monorepo structure support
- ✅ Next.js framework detection
- ✅ Build and install commands configured

### Current `vercel.json`:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd client && npm run build",
  "devCommand": "cd client && npm run dev",
  "installCommand": "cd client && npm install",
  "outputDirectory": "client/.next",
  "framework": "nextjs",
  "functions": {
    "client/src/app/api/**/*.{js,ts}": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/client/$1"
    }
  ]
}
```

## Deployment Steps

### 1. Pre-deployment Checklist
- [x] Zustand stores implemented with persistence
- [x] Notification system integrated
- [x] Vercel configuration updated
- [x] TypeScript errors resolved
- [x] Build process verified

### 2. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? [your-account]
# - Link to existing project? N
# - Project name: quizmaster-frontend
# - Directory: ./
# - Override settings? N
```

#### Option B: GitHub Integration
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Vercel will auto-detect Next.js and use the configuration

### 3. Environment Variables
Set these in Vercel dashboard:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://quizmaster-backend-production.up.railway.app
```

### 4. Domain Configuration
- Default: `https://your-project.vercel.app`
- Custom domain can be added in Vercel dashboard

## Global State Management Usage

### Authentication Store
```typescript
const { user, login, logout, isAuthenticated } = useAuthStore();
```

### Quiz Management
```typescript
const { 
  currentQuiz, 
  quizHistory, 
  setCurrentQuiz, 
  addQuizToHistory,
  loading,
  error 
} = useQuizStore();
```

### App State
```typescript
const { 
  darkMode, 
  toggleDarkMode, 
  addNotification 
} = useAppStore();
```

### Notifications
```typescript
// Success notification
addNotification('Quiz generated successfully!', 'success');

// Error notification
addNotification('Failed to load data', 'error');
```

## Key Improvements Made

1. **State Persistence**: User preferences and data persist across browser sessions
2. **Better Error Handling**: Centralized error states and user feedback
3. **Loading States**: Proper loading indicators throughout the app
4. **Notifications**: Real-time feedback for user actions
5. **Type Safety**: Full TypeScript support with proper interfaces
6. **Performance**: Optimized state updates and re-renders

## Troubleshooting

### Common Deployment Issues:

1. **Build Failures**
   - Ensure all dependencies are in `client/package.json`
   - Check TypeScript errors in build logs
   - Verify Next.js configuration

2. **API Connection Issues**
   - Confirm backend URL in `api.ts`
   - Check CORS settings on backend
   - Verify environment variables

3. **State Management Issues**
   - Check browser localStorage for persisted data
   - Verify store initialization in components
   - Monitor console for Zustand errors

### Performance Optimization:
- State is automatically optimized with Zustand
- Notifications auto-cleanup prevents memory leaks
- Persistent storage only saves essential data

## Next Steps

1. Monitor deployment for any runtime issues
2. Test all features in production environment
3. Set up analytics and error tracking
4. Consider implementing additional stores for:
   - Code editor state
   - User preferences
   - Application themes

## Support

For deployment issues:
- Check Vercel deployment logs
- Verify all environment variables
- Test API connectivity from production
- Monitor browser console for client-side errors
