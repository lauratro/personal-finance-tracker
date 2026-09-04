import { http } from '@/api/http';

export function sendMessageToAIChat(message: string) {
  http('/ai/chat', {
    method: 'POST',
    body: { prompt: message },
  });
}
