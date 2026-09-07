import { AiChatIconButton, AiChatIconContainer } from './ai-chat-icon.style';
import { IconSubtitlesAi } from '@tabler/icons-react';
import { AiChatIconProps } from './ai-chat-icon.types';

export const AiChatIcon = ({ isVisible, setIsVisible }: AiChatIconProps) => {
  return (
    <AiChatIconContainer>
      <AiChatIconButton onClick={() => setIsVisible(!isVisible)}>
        <IconSubtitlesAi stroke={2} color="white" />
      </AiChatIconButton>
    </AiChatIconContainer>
  );
};
