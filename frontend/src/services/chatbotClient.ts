import axios from 'axios';

import { API_BASE_URL } from '../config/api';

interface ChatResponse {
  success: boolean;
  data: {
    response: string;
    provider: string;
    tokensUsed: number;
    responseTime: number;
    mode: string;
  };
  error?: string;
  timestamp?: string;
}

class ChatbotClient {
  private userId: string = '';
  private conversationId: string = '';

  constructor() {
    // Generate or retrieve conversation ID
    const stored = localStorage.getItem('imanify_conversation_id');
    this.conversationId = stored || this.generateId();
    if (!stored) {
      localStorage.setItem('imanify_conversation_id', this.conversationId);
    }
  }

  private generateId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set user ID for authenticated requests
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Get or generate a user ID
   */
  private getUserId(): string {
    if (this.userId) return this.userId;
    
    const stored = localStorage.getItem('imanify_guest_id');
    if (stored) return stored;
    
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('imanify_guest_id', guestId);
    return guestId;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const userId = this.getUserId();
      const endpoint = `${API_BASE_URL}/chat/send`;
      
      console.log('[ChatBot] Sending message to:', endpoint, {
        userId,
        conversationId: this.conversationId
      });

      const response = await axios.post<ChatResponse>(endpoint, {
        message: message.trim(),
        userId,
        conversationId: this.conversationId,
        mode: 'islamic'
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Chat request failed');
      }
      
      const answer = response.data.data?.response;
      if (!answer) {
        throw new Error('No response received from chat service');
      }
      
      return answer;
    } catch (error) {
      // Handle Axios errors
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data as any;
        const errorMessage = errorData?.error || error.message;
        
        console.error('[ChatBot Error]', { status, message: errorMessage });
        
        if (status === 503) {
          throw new Error(errorMessage || 'Chat service is temporarily unavailable. Please try again in a moment.');
        }
        if (status === 401 || status === 403) {
          throw new Error('Authentication failed. Please log in again.');
        }
        if (status === 429) {
          throw new Error('Too many requests. Please wait before sending another message.');
        }
        if (status === 400) {
          throw new Error(errorMessage || 'Invalid request. Please check your message.');
        }
        if (!error.response) {
          throw new Error('Network error. Please check your connection and ensure the backend is running at ' + API_BASE_URL);
        }
        
        throw new Error(errorMessage || 'Failed to send message. Please try again.');
      }

      // Handle generic errors
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('[ChatBot Error]', message);
      throw new Error(`Chat error: ${message}`);
    }
  }
}

export const chatbotClient = new ChatbotClient();
