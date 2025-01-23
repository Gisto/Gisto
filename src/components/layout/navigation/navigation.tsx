import { Link } from 'dirty-react-router';
import { Info, SlidersHorizontal, LogOut, LayoutDashboard, Plus, Globe } from 'lucide-react';

import { version } from '../../../../package.json';

import { NavItem } from '@/components/layout/navigation/nav-item.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { ThemeSwitcher } from '@/components/theme/theme-switcher.tsx';
import { useIsOnline } from '@/hooks/use-is-online.tsx';
import { cn } from '@/lib/utils.ts';

export const Navigation = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const online = useIsOnline();

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
          <NavItem isCollapsed={isCollapsed} label="Dashboard" path="/" Icon={LayoutDashboard} />
          <NavItem isCollapsed={isCollapsed} label="About" path="/about" Icon={Info} />
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
            onClick={async () => {
              const confirmation = await confirm(`Are you sure you want to log-out?`);

              if (confirmation) {
                localStorage.removeItem('GITHUB_TOKEN');
                document.location.reload();
              }
            }}
            Icon={LogOut}
          />

          <NavItem
            isCollapsed={isCollapsed}
            label={online ? 'You are on-line' : 'You are off-line'}
            onClick={() => null}
            Icon={() => <Globe className={cn('size-4', online ? 'text-success' : 'text-danger')} />}
          />

          <ThemeSwitcher />
        </div>
      </div>
    </>
  );
};
