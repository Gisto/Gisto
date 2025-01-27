import { ReactNode } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area.tsx';

export const PageContent = ({ children }: { children: ReactNode }) => (
  <ScrollArea className="h-[calc(100vh-52px)] shadow-inner bg-light-pattern dark:bg-dark-pattern">
    <div className="p-8">{children}</div>
  </ScrollArea>
);
