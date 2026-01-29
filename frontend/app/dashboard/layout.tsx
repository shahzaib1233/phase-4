'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { ThemeProvider } from '@/context/theme';
import { userService } from '@/services/user-service';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Get user info from backend API
    const fetchUser = async () => {
      try {
        const userInfo = await userService.getCurrentUser();
        if (userInfo) {
          setUser({
            name: userInfo.name,
            email: userInfo.email
          });
        } else {
          // Redirect to sign in if no user info found
          window.location.href = '/signin';
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        // Redirect to sign in if error occurs
        window.location.href = '/signin';
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = () => {
    // Clear stored user info
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_email');
      localStorage.removeItem('auth_token');
    }
    // Redirect to sign in page
    window.location.href = '/signin';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
        <Header user={user} onSignOut={handleSignOut} />
        <div className="flex">
          <Sidebar user={user} onSignOut={handleSignOut} />
          <main className="flex-1 md:ml-64 pt-6 pb-12">
            <div className="container px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}