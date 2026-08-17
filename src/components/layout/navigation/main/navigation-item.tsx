import { Link, useRouter } from 'dirty-react-router';
import { ElementType } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { cn } from '@/utils';

const Content = ({
  label,
  isCollapsed,
  Icon,
  active,
}: {
  Icon: ElementType;
  label: string;
  isCollapsed: boolean;
  active: boolean;
}) => (
  <div
    className={cn(
      'flex justify-start gap-2 items-center transition-all duration-300 ease-in-out',
      isCollapsed && 'justify-center'
    )}
  >
    <Tooltip>
      <TooltipTrigger asChild>
        <Icon className={cn('size-4', active && 'text-gold')} />
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={16}>
        {label}
      </TooltipContent>
    </Tooltip>

    {isCollapsed ? null : label}
  </div>
);

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
  const { path: currentPath } = useRouter();
  const active = 'path' in props && props.path === currentPath;

  const wrapper = cn(
    'relative flex justify-start gap-2 items-center mb-1.5 p-2 w-full cursor-pointer rounded-lg hover:bg-accent transition-all duration-300 ease-in-out',
    active && 'bg-accent text-accent-foreground font-medium',
    isCollapsed && 'justify-center'
  );

  const indicator = active ? (
    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gold" />
  ) : null;

  if ('path' in props) {
    return (
      <Link to={props.path} className={wrapper}>
        {indicator}
        <Content Icon={Icon} label={label} isCollapsed={isCollapsed} active={active} />
      </Link>
    );
  }

  return (
    <div onClick={props.onClick} className={wrapper}>
      {indicator}
      <Content Icon={Icon} label={label} isCollapsed={isCollapsed} active={active} />
    </div>
  );
};
