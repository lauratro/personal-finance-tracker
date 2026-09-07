export interface AiChatBoxProps {
  opened: boolean;
  setOpened: (v: boolean) => void;
}

export type AiChatBoxFormValues = {
  text: string;
};
