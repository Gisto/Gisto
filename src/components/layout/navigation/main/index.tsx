import { Link } from 'dirty-react-router';
import { BadgeHelp, SlidersHorizontal, LogOut, LayoutDashboard, Plus, Globe } from 'lucide-react';

import { version } from '../../../../../package.json';

import { NavigationItem } from '@/components/layout/navigation/main/navigation-item.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { ThemeSwitcher } from '@/components/theme/theme-switcher.tsx';
import { useIsOnline } from '@/hooks/use-is-online.tsx';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

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
      <div className="flex flex-col justify-between h-[calc(100dvh_-_52px)]">
        <div className="p-2">
          <NavigationItem
            isCollapsed={isCollapsed}
            label={t('menu.dashboard')}
            path="/"
            Icon={LayoutDashboard}
          />
          <NavigationItem
            isCollapsed={isCollapsed}
            label={t('menu.newSnippet')}
            path="/new-snippet"
            Icon={Plus}
          />
        </div>

        <div className="p-2">
          <NavigationItem
            isCollapsed={isCollapsed}
            label={t('menu.about')}
            path="/about"
            Icon={BadgeHelp}
          />
          <NavigationItem
            isCollapsed={isCollapsed}
            label={t('menu.settings')}
            path="/settings"
            Icon={SlidersHorizontal}
          />
          <NavigationItem
            isCollapsed={isCollapsed}
            label={t('menu.logOut')}
            onClick={async () => {
              const confirmation = await confirm(`Are you sure you want to log-out?`);

              if (confirmation) {
                localStorage.removeItem('GITHUB_TOKEN');
                document.location.reload();
              }
            }}
            Icon={LogOut}
          />

          <NavigationItem
            isCollapsed={isCollapsed}
            label={online ? t('menu.onLine') : t('menu.offLine')}
            onClick={() => null}
            Icon={() => <Globe className={cn('size-4', online ? 'text-success' : 'text-danger')} />}
          />

          <ThemeSwitcher />
        </div>
      </div>
    </>
  );
};
