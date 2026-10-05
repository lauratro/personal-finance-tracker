import { IconSubtitlesAi } from '@tabler/icons-react';
import { AiChatIconProps } from './ai-chat-icon.types';

export const AiChatIcon = ({ isVisible, setIsVisible }: AiChatIconProps) => {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center justify-center rounded-full border-none bg-[var(--primary)] p-2.5"
      aria-label="Open Ai Assistant"
      onClick={() => setIsVisible(!isVisible)}
    >
      <IconSubtitlesAi stroke={2} color="white" />
    </button>
  );
};
