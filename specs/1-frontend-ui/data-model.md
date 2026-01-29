# Data Model: Professional & Beautiful Frontend UI for Phase II Todo Web App

## Overview
This document defines the data models used in the frontend application. Since this is a frontend specification, the data models primarily refer to the frontend state management, form data structures, and component data structures that interact with the backend API.

## User Data Model
The user data model represents authenticated users in the frontend application.

### User Interface
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### User Authentication State
```typescript
interface UserAuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
```

## Task Data Model
The task data model represents the core task entity that will be displayed and managed in the UI.

### Task Interface
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  dueDate?: Date | null;
}
```

### Task Form Data
```typescript
interface TaskFormData {
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date | null;
}
```

### Task State Management
```typescript
interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: 'all' | 'active' | 'completed';
    searchQuery: string;
  };
}
```

## Form Data Models
These models define the structure for authentication and task-related forms.

### Signup Form Data
```typescript
interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

### Signin Form Data
```typescript
interface SigninFormData {
  email: string;
  password: string;
}
```

### Form Validation Errors
```typescript
interface FormErrors {
  [key: string]: string[];
}
```

## UI State Models
These models represent various UI states that need to be managed.

### Modal State
```typescript
interface ModalState {
  isOpen: boolean;
  type: 'create-task' | 'edit-task' | 'delete-confirmation' | 'auth' | null;
  data?: any;
}
```

### Loading State
```typescript
interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}
```

### Error State
```typescript
interface ErrorState {
  hasError: boolean;
  errorMessage: string;
  errorType: 'network' | 'validation' | 'server' | 'unknown';
}
```

## Theme/Preference Model
This model handles user preferences for appearance settings.

### Theme Preferences
```typescript
interface ThemePreferences {
  mode: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'normal' | 'large';
  animationsEnabled: boolean;
}
```

## API Response Models
These models define the structure of API responses expected by the frontend.

### API Response Wrapper
```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Paginated Response
```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
```

## Local Storage Model
Defines how data is stored in the browser's local storage.

### Local Storage Keys
```typescript
enum LocalStorageKeys {
  USER_PREFERENCES = 'user-preferences',
  AUTH_TOKEN = 'auth-token',
  REFRESH_TOKEN = 'refresh-token',
  USER_DATA = 'user-data',
  THEME_PREFERENCE = 'theme-preference'
}
```

## Validation Models
Defines validation schemas and patterns used across the application.

### Validation Patterns
```typescript
interface ValidationPatterns {
  email: RegExp;
  password: RegExp;
  name: RegExp;
  title: RegExp;
}
```

### Validation Rules
```typescript
interface ValidationRules {
  email: {
    required: boolean;
    pattern: RegExp;
    maxLength: number;
  };
  password: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  taskTitle: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
}
```

## Relationships
- Each `Task` is associated with a `User` via the `userId` property
- `UserAuthState` contains the currently authenticated `User`
- `TaskState` contains multiple `Task` objects
- `ModalState` may contain data from various models depending on the modal type

## Constraints
- All dates are stored as ISO string format and converted to Date objects in the application
- Task titles must be between 1-255 characters
- User email must be unique and properly formatted
- Task descriptions are optional but limited to 1000 characters
- All API interactions must include proper JWT authentication tokens

## Assumptions
- Backend API provides consistent data structures matching these models
- Authentication tokens are properly managed by Better Auth integration
- Network requests are handled through lib/api.ts with automatic JWT inclusion
- All dates are stored in UTC and displayed according to user's local timezone