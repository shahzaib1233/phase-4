import { api } from '@/lib/api';
import { ChatRequest, ChatResponse, Conversation, ChatMessage } from '@/types/chat';

// Helper function to extract user ID from JWT token
function getUserIdFromToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // Decode JWT token to extract user ID
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );

        const decoded = JSON.parse(jsonPayload);
        return decoded.sub; // 'sub' field contains the user ID in JWT
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
      }
    }
  }
  return null;
}

class ChatService {
  private get basePath(): string {
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error('User not authenticated. Cannot access chat.');
    }
    return `/api/${userId}/chat`;
  }

  async sendMessage(message: string, conversationId?: string): Promise<ChatResponse> {
    try {
      const requestData: ChatRequest = {
        message,
        conversation_id: conversationId
      };

      const response = await api.post<ChatResponse>(this.basePath, requestData);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getConversations(): Promise<{conversations: Conversation[], count: number}> {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User not authenticated. Cannot access conversations.');
      }

      const response = await api.get<{conversations: Conversation[], count: number}>(`/api/${userId}/conversations`);
      return response;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  async getConversationDetails(conversationId: string): Promise<{
    conversation: Conversation;
    messages: ChatMessage[];
    message_count: number;
  }> {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User not authenticated. Cannot access conversation details.');
      }

      const response = await api.get<{
        conversation: Conversation;
        messages: ChatMessage[];
        message_count: number;
      }>(`/api/${userId}/conversations/${conversationId}`);
      return response;
    } catch (error) {
      console.error('Error fetching conversation details:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();