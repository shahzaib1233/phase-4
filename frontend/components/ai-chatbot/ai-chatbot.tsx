'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chatService } from '@/services/chat-service';
import { ChatMessage } from '@/types/chat';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await chatService.sendMessage(inputValue, conversationId);

      // Update conversation ID if new conversation was created
      if (response.conversation_id && !conversationId) {
        setConversationId(response.conversation_id);
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Handle tool calls if any
      if (response.tool_calls && response.tool_calls.length > 0) {
        // Add a message about the tool call
        const toolCallMessage: ChatMessage = {
          id: `tool-${Date.now()}`,
          role: 'assistant',
          content: `I've processed your request using tools.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, toolCallMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group ring-4 ring-blue-200/30 hover:ring-blue-300/40 transform hover:scale-105"
          aria-label="Open AI Chatbot"
        >
          <span className="h-8 w-8 flex items-center justify-center group-hover:animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span className="sr-only">Open AI Chatbot</span>
        </Button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-md h-[75vh] flex flex-col">
          <Card className="flex flex-col h-full border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Todo Assistant</h3>
                  <p className="text-xs opacity-80">Always here to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
                onClick={closeChat}
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 pb-4" ref={scrollAreaRef}>
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Hello! I'm your AI Assistant</h3>
                    <p className="text-gray-600 mb-4">
                      Manage your tasks using natural language
                    </p>
                    <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs py-1 px-2">Add task 'buy groceries'</Badge>
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 text-xs py-1 px-2">Show my tasks</Badge>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs py-1 px-2">Mark task 1 as complete</Badge>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        } shadow-sm`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="whitespace-pre-wrap break-words">
                              {message.content}
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                message.role === 'user'
                                  ? 'text-white/70'
                                  : 'text-gray-500'
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                          {message.role === 'user' && (
                            <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-none p-4 max-w-[85%] shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t bg-gray-50 rounded-b-xl">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me to manage your tasks..."
                    disabled={isLoading}
                    className="flex-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl px-3"
                    aria-label="Type your message"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    aria-label="Send message"
                    className="h-11 w-11 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m22 2-7 20-4-9-9-4Z"/>
                    </svg>
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by Cohere AI • Natural language task management
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}