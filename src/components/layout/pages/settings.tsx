import { SidebarClose, SidebarOpen } from 'lucide-react';

import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { Search } from '@/components/search.tsx';
import { Button } from '@/components/ui/button.tsx';

type Props = {
  isCollapsed?: boolean;
  setIsCollapsed?: (b: boolean) => void;
  params?: Record<string, string>;
};

export const Settings = ({ isCollapsed = false, setIsCollapsed = () => {} }: Props = {}) => {
  return (
    <div className="h-screen w-full border-r border-collapse">
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
              {!isCollapsed ? (
                <SidebarClose className="size-4" />
              ) : (
                <SidebarOpen className="size-4" />
              )}
            </Button>

            <div className="line-clamp-1">Settings</div>
          </div>
        </div>
      </PageHeader>

      <div className="p-4">
        <Search />
      </div>
    </div>
  );
};
