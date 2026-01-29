# Quickstart Guide: Professional & Beautiful Frontend UI for Phase II Todo Web App

## Overview
This quickstart guide provides the essential steps to set up, run, and begin developing the Professional & Beautiful Frontend UI for the Todo Web App. It covers the initial setup, development workflow, and key commands needed to get started quickly.

## Prerequisites

### System Requirements
- Node.js version 18.x or higher
- npm or yarn package manager
- Git version control system
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Development Tools
- A code editor (VS Code recommended)
- Terminal/command line access
- Basic understanding of TypeScript and React

## Initial Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Navigate to Frontend Directory
```bash
cd frontend
```

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Environment Configuration
Create a `.env.local` file in the `frontend` directory with the following variables:

```env
# Better Auth Configuration
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Database Configuration (if needed)
DATABASE_URL=your-database-url
```

## Development Server

### Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm run test

# Run linting
npm run lint

# Format code
npm run format
```

## Project Structure
```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/         # Main dashboard
│   │   └── page.tsx
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (buttons, inputs, etc.)
│   ├── layout/           # Layout components
│   └── tasks/            # Task-specific components
├── lib/                  # Utility functions
│   ├── api.ts            # API service
│   ├── validation.ts     # Form validation
│   └── utils.ts          # General utilities
├── context/              # React Context providers
│   └── theme.tsx         # Theme context
├── services/             # API service clients
│   └── task-service.ts   # Task API service
├── styles/               # Global styles (if needed)
└── types/                # TypeScript type definitions
```

## Key Development Workflows

### 1. Creating a New Component
1. Create the component file in the appropriate directory under `/components`
2. Use Tailwind CSS for styling
3. Follow atomic design principles
4. Export the component with proper TypeScript interfaces

Example:
```tsx
// components/ui/button.tsx
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded font-medium transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
          'border border-gray-300 text-gray-700 hover:bg-gray-50': variant === 'outline',
          'px-2 py-1 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 2. Adding a New Page
1. Create a new directory under `/app` with your page name
2. Create a `page.tsx` file in that directory
3. Use server components for data fetching when possible
4. Use client components for interactivity

Example:
```tsx
// app/tasks/page.tsx
'use client';

import { TaskList } from '@/components/tasks/task-list';

export default function TasksPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      <TaskList />
    </div>
  );
}
```

### 3. Working with API Calls
1. Use the centralized API service in `lib/api.ts`
2. Create specific service files for different entities (e.g., `services/task-service.ts`)
3. Handle JWT tokens automatically through the API service
4. Implement proper error handling

Example:
```ts
// services/task-service.ts
import { api } from '@/lib/api';
import { Task } from '@/types/task';

export async function getTasks(): Promise<Task[]> {
  const response = await api.get('/tasks');
  return response.data;
}

export async function createTask(taskData: Partial<Task>): Promise<Task> {
  const response = await api.post('/tasks', taskData);
  return response.data;
}
```

### 4. Implementing Authentication
1. Use Better Auth for authentication flows
2. Protect routes that require authentication
3. Handle JWT tokens automatically
4. Implement proper error handling for authentication failures

Example:
```tsx
// components/auth/protected-route.tsx
'use client';

import { useAuth } from 'better-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuth, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push('/signin');
    }
  }, [isAuth, router]);

  if (!isAuth) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
```

## Styling Guidelines

### Tailwind CSS Usage
- Use Tailwind utility classes exclusively (no custom CSS files)
- Follow the design system defined in the project
- Use consistent spacing and typography scales
- Implement dark mode using `dark:` variants

### Component Styling Example
```tsx
// Example of proper Tailwind usage
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
    Task Title
  </h3>
  <p className="text-gray-600 dark:text-gray-300 mb-4">
    Task description goes here
  </p>
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
    Complete Task
  </button>
</div>
```

## Testing Quickstart

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- path/to/test-file.test.tsx
```

### Writing Component Tests
```tsx
// Example test file
import { render, screen } from '@testing-library/react';
import { TaskCard } from '@/components/tasks/task-card';

describe('TaskCard', () => {
  it('renders task title correctly', () => {
    render(
      <TaskCard
        task={{
          id: '1',
          title: 'Test Task',
          completed: false,
          createdAt: new Date(),
          userId: 'user1'
        }}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

## Common Tasks

### Adding a New Environment Variable
1. Add the variable to `.env.local`
2. Add the variable to your deployment configuration
3. Access it in code using `process.env.VARIABLE_NAME`

### Creating a New API Service
1. Create a new file in `/services` (e.g., `user-service.ts`)
2. Use the API service from `lib/api.ts` for requests
3. Export specific functions for different operations

### Adding a New Route
1. Create a new directory under `/app`
2. Add a `page.tsx` file
3. Add any necessary layout files
4. Update navigation if needed

## Troubleshooting

### Common Issues and Solutions

**Issue**: Authentication not working
**Solution**: Ensure JWT secret is properly configured and API calls include proper headers

**Issue**: Tailwind styles not applying
**Solution**: Check that Tailwind is properly configured and that you're using the correct class names

**Issue**: API calls failing
**Solution**: Verify that the backend is running and that CORS is properly configured

**Issue**: Dark mode not working
**Solution**: Ensure the theme context is properly set up and Tailwind dark mode is configured

### Development Tips
- Use the Next.js development server for hot reloading
- Check browser console for errors during development
- Use React Developer Tools for debugging component state
- Run `npm run lint` regularly to catch issues early

## Next Steps

### After Initial Setup
1. Review the design specifications in the spec documents
2. Set up your preferred code editor with TypeScript support
3. Run the development server to verify everything works
4. Review the existing components to understand the code patterns
5. Check out the tasks in `specs/1-frontend-ui/tasks.md` to begin implementation

### Getting Help
- Refer to the main specification documents for detailed requirements
- Check the tasks document for specific implementation steps
- Look at existing components for examples of proper implementation
- Consult the project constitution for architectural constraints

This quickstart guide should provide everything needed to begin developing the Professional & Beautiful Frontend UI. For more detailed information, refer to the specific documentation files in the project repository.