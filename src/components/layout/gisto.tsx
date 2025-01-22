import { useRouter, Outlet } from 'dirty-react-router';
import * as React from 'react';
import { useEffect } from 'react';

import { Lists } from '@/components/layout/navigation/list';
import { Navigation } from '@/components/layout/navigation/navigation.tsx';
import { PATHS_WITHOUT_SNIPPET_LIST } from '@/constants';
import { updateSettings, useStoreValue } from '@/lib/store/globalState.ts';
import { cn } from '@/lib/utils.ts';

export const Gisto = () => {
  const settings = useStoreValue('settings');
  const [isCollapsed, setIsCollapsed] = React.useState(settings.sidebarCollapsedByDefault);
  const { path } = useRouter();

  useEffect(() => {
    updateSettings({ sidebarCollapsedByDefault: isCollapsed });
  }, [isCollapsed]);

  return (
    <div className="overflow-hidden bg-background w-screen h-screen sticky">
      <div className="flex border-t">
        <div
          className={cn(
            'h-screen border-b border-r border-collapse',
            isCollapsed ? 'w-[52px] min-w-[52px]' : 'w-[200px] min-w-[200px]'
          )}
        >
          <Navigation isCollapsed={isCollapsed} />
        </div>

        {PATHS_WITHOUT_SNIPPET_LIST.includes(path) ? null : (
          <div className={cn('h-screen w-[340px] min-w-[340px] border-r')}>
            <Lists isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          </div>
        )}

        <Outlet setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};
