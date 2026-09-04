import { ReactNode } from 'react';
import { AppMenubar } from '../../components/ui/app-menubar/app-menubar';
import { Wrapper, PageContent } from './page-container.style';
import { AiChatIcon } from '@/components/ui/ai-chat-icon';

interface PageContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const PageContainer = ({
  title,
  description,
  children,
}: PageContainerProps) => {
  return (
    <Wrapper>
      <AppMenubar />

      <main className="mx-auto w-full px-2 pt-6 pb-4 md:px-6 md:py-8">
        <div className="mb-4 mx-4 pt-4 mt-[50px] md:mt-[70px]">
          <h1>{title}</h1>

          {description ? <p>{description}</p> : null}
        </div>

        <PageContent>
          <AiChatIcon />
          {children}
        </PageContent>
      </main>
    </Wrapper>
  );
};
