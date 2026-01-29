'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for the AI Chatbot component
const AIChatbot = dynamic(() => import('./ai-chatbot'), {
  ssr: false,
  loading: () => null,
});

export default function AIChatbotWrapper() {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);

    // Listen for auth changes
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem('auth_token');
      setIsLoggedIn(!!currentToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isClient && isLoggedIn) {
    return <AIChatbot />;
  }

  return null;
}