import { AiChatIconButton, AiChatIconContainer } from './ai-chat-icon.style';
import { IconSubtitlesAi } from '@tabler/icons-react';
import React, { useState } from 'react';

export const AiChatIcon = () => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <AiChatIconContainer>
      <AiChatIconButton onClick={() => setIsVisible(!isVisible)}>
        <IconSubtitlesAi stroke={2} color="white" />
      </AiChatIconButton>
    </AiChatIconContainer>
  );
};
