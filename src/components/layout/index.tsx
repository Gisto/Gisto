import { useRouter, Outlet } from 'dirty-react-router';
import * as React from 'react';
import { useEffect } from 'react';

import { Navigation } from '@/components/layout/navigation/main';
import { Lists } from '@/components/layout/navigation/snippets-list';
import { PATHS_WITHOUT_SNIPPET_LIST } from '@/constants';
import { useIsMobile } from '@/hooks/use-mobile.tsx';
import { updateSettings, useStoreValue } from '@/lib/store/globalState.ts';
import { cn } from '@/lib/utils';

export const MainLayout = () => {
  const settings = useStoreValue('settings');
  const [isCollapsed, setIsCollapsed] = React.useState(settings.sidebarCollapsedByDefault);
  const { path } = useRouter();
  const isMobile = useIsMobile();

  const isListHidden =
    (isMobile && path.startsWith('/snippets/')) ||
    PATHS_WITHOUT_SNIPPET_LIST.includes(path) ||
    path.startsWith('/edit/');

  useEffect(() => {
    updateSettings({ sidebarCollapsedByDefault: isCollapsed });
  }, [isCollapsed]);

  return (
    <div className="overflow-hidden bg-background w-screen h-dvh sticky">
      <div className="flex border-t">
        <div
          className={cn(
            'h-screen border-b border-r border-collapse',
            isCollapsed ? 'w-[52px] min-w-[52px]' : 'w-[200px] min-w-[200px]'
          )}
        >
          <Navigation isCollapsed={isCollapsed} />
        </div>

        {isListHidden ? null : (
          <div
            className={cn(
              'h-screen w-[380px] min-w-[380px] sm:w-[340px] sm:min-w-[340px] border-r'
            )}
          >
            <Lists isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          </div>
        )}

        <Outlet setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};
