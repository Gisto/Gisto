import { Info } from 'lucide-react';
import { ReactNode } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';

export const SimpleTooltip = ({
  children,
  content,
  className,
}: {
  children?: ReactNode;
  content: ReactNode;
  className?: string;
}) => {
  const DefaultTrigger = <Info strokeWidth={1.5} className="size-3" />;
  return (
    <Tooltip>
      <TooltipTrigger>{children ?? DefaultTrigger}</TooltipTrigger>
      <TooltipContent className={className}>⚠︎ {content}</TooltipContent>
    </Tooltip>
  );
};
