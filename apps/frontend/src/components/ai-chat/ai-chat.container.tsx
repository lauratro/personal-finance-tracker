import { lazy, Suspense, useState } from 'react';
import { AiChatIcon } from './parts/ai-chat-icon';

const AiChatBox = lazy(() =>
  import('./parts/ai-chat-box').then((module) => ({
    default: module.AiChatBox,
  })),
);

export const AiChatBoxContainer = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[100]">
      <AiChatIcon isVisible={isVisible} setIsVisible={setIsVisible} />
      {isVisible && (
        <Suspense
          fallback={
            <div
              className="absolute bottom-16 right-0 rounded-lg bg-white px-4 py-3 text-sm text-gray-500 shadow-lg"
              role="status"
            >
              Loading assistant…
            </div>
          }
        >
          <AiChatBox opened={isVisible} setOpened={setIsVisible} />
        </Suspense>
      )}
    </div>
  );
};
