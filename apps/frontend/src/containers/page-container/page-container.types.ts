import { ReactNode } from 'react';

export interface PageContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
}
