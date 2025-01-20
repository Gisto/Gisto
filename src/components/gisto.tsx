import * as React from 'react';

import { useRouter, Outlet } from 'dirty-react-router';

import { cn } from '@/lib/utils.ts';

import { Lists } from '@/components/layout/list';
import { Navigation } from '@/components/layout/navigation.tsx';
import { PATHS_WITHOUT_SNIPPET_LIST } from '@/constants';

export const Gisto = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { path } = useRouter();

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
          <div className={cn('h-screen w-[400px] min-w-[400px] border-r')}>
            <Lists isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          </div>
        )}

        <Outlet setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};
