import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AIChatbotWrapper from '@/components/ai-chatbot/chatbot-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App - Professional Task Management',
  description: 'A premium todo application with beautiful UI and seamless experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <AIChatbotWrapper />
      </body>
    </html>
  );
}

