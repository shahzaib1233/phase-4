export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  tool_calls?: Array<{
    name: string;
    arguments: Record<string, any>;
  }>;
}

export interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}