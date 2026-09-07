export interface AiChatBoxProps {
  opened: boolean;
  setOpened: (v: boolean) => void;
}

export type AiChatBoxFormValues = {
  text: string;
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
