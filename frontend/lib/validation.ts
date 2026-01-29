// Validation utilities for the Todo application

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Task title validation
export const validateTaskTitle = (title: string): boolean => {
  return title.trim().length >= 1 && title.trim().length <= 255;
};

// Name validation
export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

// Generic validation result type
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validate signup form data
export const validateSignupForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult => {
  const errors: string[] = [];

  if (!validateName(name)) {
    errors.push('Name must be between 2 and 100 characters');
  }

  if (!validateEmail(email)) {
    errors.push('Please enter a valid email address');
  }

  if (!validatePassword(password)) {
    errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate signin form data
export const validateSigninForm = (
  email: string,
  password: string
): ValidationResult => {
  const errors: string[] = [];

  if (!validateEmail(email)) {
    errors.push('Please enter a valid email address');
  }

  if (password.length < 1) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate task form data
export const validateTaskForm = (
  title: string,
  description?: string
): ValidationResult => {
  const errors: string[] = [];

  if (!validateTaskTitle(title)) {
    errors.push('Task title is required and must be between 1 and 255 characters');
  }

  if (description && description.length > 1000) {
    errors.push('Task description must be less than 1000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  name: /^.{2,100}$/,
  title: /^.{1,255}$/,
};

// Validation rules
export const validationRules = {
  email: {
    required: true,
    pattern: validationPatterns.email,
    maxLength: 255,
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
  },
  taskTitle: {
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
};

// Form error type
export interface FormErrors {
  [key: string]: string[];
}

// Validate field individually
export const validateField = (fieldName: string, value: string): string[] => {
  const errors: string[] = [];

  switch (fieldName) {
    case 'email':
      if (!validateEmail(value)) {
        errors.push('Please enter a valid email address');
      }
      break;
    case 'password':
      if (!validatePassword(value)) {
        errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
      }
      break;
    case 'name':
      if (!validateName(value)) {
        errors.push('Name must be between 2 and 100 characters');
      }
      break;
    case 'title':
      if (!validateTaskTitle(value)) {
        errors.push('Task title is required and must be between 1 and 255 characters');
      }
      break;
    default:
      break;
  }

  return errors;
};