'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { validateSignupForm } from '@/lib/validation';
import { authClient } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();

  // Check if user is already logged in and redirect to dashboard
  React.useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    // Validate form
    const validation = validateSignupForm(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach(error => {
        if (error.includes('Name')) newErrors.name = error;
        else if (error.includes('email')) newErrors.email = error;
        else if (error.includes('Password')) newErrors.password = error;
        else if (error.includes('Passwords do not match')) newErrors.confirmPassword = error;
      });
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Use Better Auth to sign up
      const response = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        fetchOptions: {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      });

      if (response.error) {
        setGeneralError(response.error.message || 'An error occurred during signup');
      } else {
        // Redirect to dashboard on successful signup
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setGeneralError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join our task management platform today</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {generalError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {generalError}
              </div>
            )}

            <div className="space-y-2">
              <Input
                label="Full Name"
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                fullWidth
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                fullWidth
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                fullWidth
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                fullWidth
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col">
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <a
                href="/signin"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign in
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}