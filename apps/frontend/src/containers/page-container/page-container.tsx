import { ReactNode } from 'react';
import { AppMenubar } from '../../components/ui/app-menubar/app-menubar';

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
    <div className="page-container-shell">
      <AppMenubar />
  
      <main className="page-container-content">
        <div className="page-header">
          <h1>{title}</h1>
        
          {description ? <p>{description}</p> : null}
        </div>

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

