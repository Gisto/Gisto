import { Link } from 'dirty-react-router';
import { BadgeHelp, SlidersHorizontal, LogOut, LayoutDashboard, Plus, Globe } from 'lucide-react';

import { version } from '../../../../../package.json';

import { GitHubIcon, GitLabIcon } from '@/components/icons';
import { NavigationItem } from '@/components/layout/navigation/main/navigation-item.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { ThemeSwitcher } from '@/components/theme/theme-switcher.tsx';
import { useIsOnline } from '@/hooks/use-is-online.tsx';
import { t } from '@/lib/i18n';
import { useStoreValue, globalState } from '@/lib/store/globalState.ts';
import { cn } from '@/utils';

export const Navigation = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const online = useIsOnline();
  const user = useStoreValue('user');
  const settings = useStoreValue('settings');
  const userRecord = (user ?? {}) as Record<string, unknown>;
  const displayName =
    (typeof userRecord.name === 'string' && userRecord.name) ||
    (typeof userRecord.login === 'string' && userRecord.login) ||
    (typeof userRecord.username === 'string' && userRecord.username) ||
    '';
  const handle =
    (typeof userRecord.login === 'string' && userRecord.login) ||
    (typeof userRecord.username === 'string' && userRecord.username) ||
    '';
  const avatarUrl = typeof userRecord.avatar_url === 'string' ? userRecord.avatar_url : '';
  const initialsSource = displayName || handle;
  const initials = initialsSource
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <>
      <PageHeader>
        {isCollapsed ? (
          <h1 className="text-[1rem] whitespace-nowrap text-primary hover:text-primary/80 font-semibold transition-all duration-300 ease-in-out">
            <Link to={'/'}>{'{ G }'}</Link>
          </h1>
        ) : (
          <div className="flex items-center justify-between w-full transition-all duration-300 ease-in-out">
            <h2 className="text-primary hover:text-primary/80 font-semibold text-xl transition-all duration-300 ease-in-out">
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
            label={online ? t('menu.onLine') : t('menu.offLine')}
            onClick={() => null}
            Icon={() => <Globe className={cn('size-4', online ? 'text-success' : 'text-danger')} />}
          />

          <ThemeSwitcher
            showLabel={!isCollapsed}
            triggerMode="row"
            className={cn(isCollapsed && 'justify-center')}
          />

          <NavigationItem
            isCollapsed={isCollapsed}
            label={t('menu.logOut')}
            onClick={async () => {
              const confirmation = await confirm(`Are you sure you want to log-out?`);

              if (confirmation) {
                localStorage.removeItem('GITHUB_TOKEN');
                localStorage.removeItem('GITLAB_TOKEN');
                localStorage.removeItem('ACTIVE_PROVIDER');
                globalState.setState({
                  user: null,
                  isLoggedIn: false,
                  settings: {
                    ...globalState.getState().settings,
                    activeSnippetProvider: 'github',
                  },
                });
                window.location.reload();
              }
            }}
            Icon={LogOut}
          />

          {displayName && (
            <div
              className={cn(
                'mb-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-all duration-300 ease-in-out',
                isCollapsed && 'justify-center px-0'
              )}
              title={displayName}
            >
              <div className="size-6 shrink-0 overflow-hidden rounded-full bg-muted text-muted-foreground">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center text-[9px] font-semibold">
                    {initials || '?'}
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <div className="min-w-0 transition-all duration-300 ease-in-out">
                  <div className="truncate text-sm font-medium">{displayName}</div>
                  {handle && handle !== displayName && (
                    <div className="truncate text-xs text-muted-foreground flex items-center gap-1">
                      @{handle} /
                      <span className="inline-flex items-center size-3">
                        {settings.activeSnippetProvider === 'gitlab' ? (
                          <GitLabIcon />
                        ) : (
                          <GitHubIcon />
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
