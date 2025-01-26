import { Link } from 'dirty-react-router';
import { ElementType } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { cn } from '@/lib/utils.ts';

export const NavigationItem = ({
  Icon,
  label,
  isCollapsed,
  ...props
}: {
  Icon: ElementType;
  label: string;
  isCollapsed: boolean;
} & ({ onClick: () => void } | { path: string })) => {
  const wrapper = cn(
    'flex justify-start gap-2 items-center mb-2 p-2 w-full cursor-pointer rounded hover:bg-secondary',
    isCollapsed && 'justify-center'
  );

  const Content = () => (
    <div className={cn('flex justify-start gap-2 items-center ', isCollapsed && 'justify-center')}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Icon className="size-4" />
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={16}>
          {label}
        </TooltipContent>
      </Tooltip>

      {isCollapsed ? null : label}
    </div>
  );

  if ('path' in props) {
    return (
      <Link to={props.path} className={wrapper}>
        <Content />
      </Link>
    );
  }

  return (
    <div onClick={props.onClick} className={wrapper}>
      <Content />
    </div>
  );
};
