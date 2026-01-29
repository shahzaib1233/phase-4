'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  // Check if user is already logged in
  React.useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Optionally redirect to dashboard if user is already logged in
      // For now, we'll just update the button behavior
    }
  }, []);

  const handleGetStarted = () => {
    // If user is already logged in, go to dashboard, otherwise go to signup
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };

  const handleSignIn = () => {
    // If user is already logged in, go to dashboard, otherwise go to sign in
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/signin');
    }
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = React.useState(false);

  React.useEffect(() => {
    // Check authentication status on client side
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(token !== null);
    setHasCheckedAuth(true);
  }, []);

  // Don't render buttons until auth status is checked to avoid hydration mismatch
  if (!hasCheckedAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <header className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Todo App</h1>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button onClick={handleGetStarted}>
                Get Started
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-2xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Task Management
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              A beautiful and intuitive todo application to help you organize your tasks and boost productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted}>
                Create Account
              </Button>
              <Button variant="outline" size="lg" onClick={handleSignIn}>
                Sign In
              </Button>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Todo App. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Todo App</h1>
          <div className="flex gap-3">
            {isLoggedIn ? (
              <Button onClick={handleDashboard}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleSignIn}>
                  Sign In
                </Button>
                <Button onClick={handleGetStarted}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Task Management
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            A beautiful and intuitive todo application to help you organize your tasks and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <Button size="lg" onClick={handleDashboard}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={handleGetStarted}>
                  Create Account
                </Button>
                <Button variant="outline" size="lg" onClick={handleSignIn}>
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Todo App. All rights reserved.</p>
      </footer>
    </div>
  );
}