import { ReactNode } from 'react';
import { AppMenubar } from '../../components/ui/app-menubar/app-menubar';
import { MainContainer, Wrapper, PageContent } from './page-container.style';

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
  
      <main className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-8">
        <div className="mb-4">
          <h1>{title}</h1>
        
          {description ? <p>{description}</p> : null}
        </div>

        <PageContent>{children}</PageContent>
      </main>
    </Wrapper>
  );
}

