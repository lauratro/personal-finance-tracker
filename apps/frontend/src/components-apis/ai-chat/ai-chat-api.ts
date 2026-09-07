import { http } from '@/api/http';
import { AiChatResponse } from './ai-chat.types';

export function sendMessageToAIChat(message: string): Promise<AiChatResponse> {
  return http<AiChatResponse>('/ai/chat', {
    method: 'POST',
    body: {
      prompt: message,
    },
  });
}
