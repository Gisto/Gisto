import { Info, SlidersHorizontal, LogOut, LayoutDashboard, Plus } from 'lucide-react';

import { ElementType } from 'react';

import { Link } from 'dirty-react-router';

import { version } from '../../../package.json';

import { PageHeader } from '@/components/layout/page-header.tsx';

import { cn } from '@/lib/utils.ts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';

import { ThemeSwitcher } from '@/components/layout/theme-switcher.tsx';

const NavItem = ({
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
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Icon className="size-4" />
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
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

export const Navigation = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <>
      <PageHeader>
        {isCollapsed ? (
          <h1 className="text-[1rem] whitespace-nowrap text-primary hover:text-primary/80 font-semibold">
            <Link to={'/'}>{'{ G }'}</Link>
          </h1>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-primary hover:text-primary/80 font-semibold text-xl">
              <Link to={'/'}>{'{ Gisto } '}</Link>{' '}
              <small className="text-xs font-light">v{version}</small>
            </h2>
          </div>
        )}
      </PageHeader>
      <div className="flex flex-col justify-between h-[calc(100vh-52px)]">
        <div className="p-2">
          <NavItem isCollapsed={isCollapsed} label="New snippet" path="/new-snippet" Icon={Plus} />
          <NavItem isCollapsed={isCollapsed} label="About" path="/about" Icon={Info} />
          <NavItem isCollapsed={isCollapsed} label="Dashboard" path="/" Icon={LayoutDashboard} />
        </div>

        <div className="p-2">
          <NavItem
            isCollapsed={isCollapsed}
            label="Settings"
            path="/settings"
            Icon={SlidersHorizontal}
          />
          <NavItem
            isCollapsed={isCollapsed}
            label="Log-out"
            onClick={() => {
              localStorage.removeItem('GITHUB_TOKEN');
              document.location.reload();
            }}
            Icon={LogOut}
          />

          <ThemeSwitcher />
        </div>
      </div>
    </>
  );
};
