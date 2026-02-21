import * as React from 'react';

import { cn } from '@/utils';

export const PageHeader = ({
  children,
  classNames,
}: {
  children: React.ReactNode;
  classNames?: string;
}) => (
  <div className={cn('flex gap-2 h-[52px] items-center p-2 border-b', classNames)}>{children}</div>
);
