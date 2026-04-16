import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:3000/api';

interface ChatResponse {
  success: boolean;
  data: {
    answer: string;
  };
  error?: string;
  timestamp?: string;
}

class ChatbotClient {
  async sendMessage(message: string): Promise<string> {
    try {
      console.log('[ChatBot] Sending message to:', `${API_BASE_URL}/chat`);
      const response = await axios.post<ChatResponse>(`${API_BASE_URL}/chat`, { message });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Chat request failed');
      }
      
      const answer = response.data.data?.answer;
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
