import { ReactNode } from 'react';

export const PageContent = ({ children }: { children: ReactNode }) => (
  <div className="p-8 overflow-auto h-[calc(100vh-52px)] shadow-inner bg-light-pattern dark:bg-dark-pattern">
    {children}
  </div>
);
