import { AiChatIcon } from './parts/ai-chat-icon';
import React, { useState } from 'react';

export const AiChatBoxContainer = () => {
  const [isVisible, setIsVisible] = useState(false);
  return <AiChatIcon isVisible={isVisible} setIsVisible={setIsVisible} />;
};
