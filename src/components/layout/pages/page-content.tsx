import { ReactNode } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area.tsx';

export const PageContent = ({ children }: { children: ReactNode }) => (
  <ScrollArea className="h-[calc(100vh-52px)] bg-background">
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_75%_0%,color-mix(in_srgb,var(--gold)_12%,transparent),transparent_70%)]"
      />
      <div className="relative p-8">{children}</div>
    </div>
  </ScrollArea>
);
