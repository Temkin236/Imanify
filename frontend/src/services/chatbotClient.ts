import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface ChatMessage {
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
}

class ChatbotClient {
  async sendMessage(message: string, userId: string = 'user'): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/message`, {
        message,
        userId
      });
      return response.data.data.response;
    } catch (error) {
      throw new Error(
        `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getChatHistory(userId: string = 'user'): Promise<ChatMessage[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/history/${userId}`);
      return response.data.data.messages;
    } catch (error) {
      throw new Error(
        `Failed to fetch chat history: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async clearChatHistory(userId: string = 'user'): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/chat/history/${userId}`);
    } catch (error) {
      throw new Error(
        `Failed to clear chat history: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

export const chatbotClient = new ChatbotClient();
