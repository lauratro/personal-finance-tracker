import { AiChatIcon } from './parts/ai-chat-icon';
import React, { useState } from 'react';
import { AiChatBox } from './parts/ai-chat-box';
import { AiChatContainerStyle } from './ai-chat-container.style';

export const AiChatBoxContainer = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <AiChatContainerStyle>
      <AiChatIcon isVisible={isVisible} setIsVisible={setIsVisible} />
      {isVisible && <AiChatBox opened={isVisible} setOpened={setIsVisible} />}
    </AiChatContainerStyle>
  );
};
