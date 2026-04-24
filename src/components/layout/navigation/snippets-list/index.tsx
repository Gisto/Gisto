import { useRouter } from 'dirty-react-router';
import {
  FileCode,
  RefreshCcw,
  SidebarClose,
  SidebarOpen,
  Plus,
  Loader,
  List,
  Tag,
  ChevronsUpDown,
  ChevronsUp,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { FilterDropdown } from '@/components/layout/navigation/snippets-list/filter-dropdown.tsx';
import { ListItem } from '@/components/layout/navigation/snippets-list/item.tsx';
import { SearchInput } from '@/components/layout/navigation/snippets-list/search-input.tsx';
import { TreeView } from '@/components/layout/navigation/snippets-list/tree-view.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { Loading } from '@/components/loading.tsx';
import { Button } from '@/components/ui/button.tsx';
import { EmptyState } from '@/components/ui/empty-state.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import useIntersectionObserver from '@/hooks/use-intersection-observer.tsx';
import { useSnippets } from '@/hooks/use-snippets.tsx';
import { t } from '@/lib/i18n';
import { globalState, useStoreValue } from '@/lib/store/globalState.ts';
import { SnippetEnrichedType } from '@/types/snippet.ts';
import { searchFilter } from '@/utils';
const LazyListItem = ({ snippet }: { snippet: SnippetEnrichedType }) => {
  const [isInView, ref] = useIntersectionObserver<HTMLDivElement>();

  return (
    <div ref={ref}>{isInView ? <ListItem snippet={snippet} /> : <div className="h-[80px]" />}</div>
  );
};

const ListSkeleton = () =>
  [...Array.from({ length: 10 })].map((_, index) => {
    return (
      <div key={`item-${index}`}>
        <div className="p-4 animate-pulse border-b hover:border-l-primary hover:border-l-4 transform transition-all">
          <div className="w-2/3 h-4 bg-accent rounded mb-4"></div>
          <div className="w-full h-6 bg-accent rounded mb-4"></div>
          <div className="flex justify-between gap-8">
            <div className="w-1/2 h-3 bg-accent rounded"></div>
            <div className="w-1/2 h-3 bg-accent rounded"></div>
          </div>
        </div>
      </div>
    );
  });

const RefreshButton = ({
  isLoading,
  isRefreshing,
  onClick,
}: {
  isLoading: boolean;
  isRefreshing: boolean;
  onClick: () => void;
}) => {
  if (isRefreshing) {
    return <Loader size={16} className="animate-spin" />;
  }

  if (!isLoading) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <RefreshCcw className="size-3 cursor-pointer" onClick={onClick} />
        </TooltipTrigger>
        <TooltipContent>{t('list.refreshTheList')}</TooltipContent>
      </Tooltip>
    );
  }

  return null;
};

const SnippetsListFooter = ({
  isLoading,
  isRefreshing,
  refresh,
  filteredCount,
  totalCount,
  totalSnippetCount,
  apiRateLimits,
}: {
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => void;
  filteredCount: number;
  totalCount: number;
  totalSnippetCount: number;
  apiRateLimits?: { remaining: number; limit: number; reset: string } | null;
}) => {
  return (
    <div className="h-[48px] border-t flex items-center justify-between p-4 gap-2 text-[10px]">
      <div className="flex items-center gap-2">
        {totalCount > 0 ? (
          <>
            <FileCode className="size-3" />{' '}
            {t('list.filteredSnippets', {
              filtered: filteredCount,
              number: totalSnippetCount || totalCount,
            })}
            {isLoading && <Loader size={16} className="animate-spin" />}
          </>
        ) : isLoading ? (
          <>
            <Loading size={3} className="flex items-center justify-center mr-1" />{' '}
            {t('list.refreshingData')}
          </>
        ) : null}

        <RefreshButton isLoading={isLoading} isRefreshing={isRefreshing} onClick={refresh} />
      </div>
      <div>
        {apiRateLimits && (
          <Tooltip>
            <TooltipTrigger>
              {t('list.apiRate')}: {apiRateLimits.remaining}/{apiRateLimits.limit}
            </TooltipTrigger>
            <TooltipContent>
              {t('list.apiRateLimit')}, {apiRateLimits.limit}/{t('common.hour')}{' '}
              {t('list.nextReset')}: {apiRateLimits.reset}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export const Lists = ({
  setIsCollapsed,
  isCollapsed,
}: {
  setIsCollapsed: (b: boolean) => void;
  isCollapsed: boolean;
}) => {
  const { navigate } = useRouter();
  const { isLoading, isRefreshing, refresh } = useSnippets();
  const allSnippets = useStoreValue('snippets');
  const search = useStoreValue('search');
  const apiRateLimits = useStoreValue('apiRateLimits');
  const totalSnippetCount = useStoreValue('totalSnippetCount');
  const settings = useStoreValue('settings');
  const sidebarViewMode = settings?.sidebarViewMode || 'list';
  const [allExpanded, setAllExpanded] = useState(false);

  const handleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed, setIsCollapsed]);

  const handleViewModeChange = useCallback(
    (mode: 'list' | 'tags' | 'languages') => {
      globalState.setState({
        settings: { ...settings, sidebarViewMode: mode },
      });
    },
    [settings]
  );

  // Memoize filtered results using only the debounced global search
  const listOfSnippets = useMemo(() => {
    return searchFilter(search, allSnippets);
  }, [search, allSnippets]);

  if (!listOfSnippets) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCollapse}
          className="transition-transform duration-300 ease-in-out hover:scale-110"
        >
          {!isCollapsed ? (
            <SidebarClose className="size-4 transition-transform duration-300 ease-in-out" />
          ) : (
            <SidebarOpen className="size-4 transition-transform duration-300 ease-in-out" />
          )}
        </Button>
        <SearchInput allSnippets={allSnippets} />

        <FilterDropdown />
      </PageHeader>
      <div className="flex items-center justify-between px-2 py-1.5 border-b">
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-1">View:</span>
          <Button
            variant={sidebarViewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => handleViewModeChange('list')}
            className="h-6 px-1.5 text-xs gap-1"
          >
            <List className="size-3" />
            {t('common.list')}
          </Button>
          <Button
            variant={sidebarViewMode === 'tags' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => handleViewModeChange('tags')}
            className="h-6 px-1.5 text-xs gap-1"
          >
            <Tag className="size-3" />
            {t('common.tags')}
          </Button>
          <Button
            variant={sidebarViewMode === 'languages' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => handleViewModeChange('languages')}
            className="h-6 px-1.5 text-xs gap-1"
          >
            <FileCode className="size-3" />
            {t('common.languages')}
          </Button>
        </div>
        {sidebarViewMode !== 'list' && (
          <Button
            variant="ghost"
            size="icon"
            className="size-6 rounded-md"
            onClick={() => setAllExpanded((prev) => !prev)}
          >
            {allExpanded ? (
              <ChevronsUp className="size-4" />
            ) : (
              <ChevronsUpDown className="size-4" />
            )}
          </Button>
        )}
      </div>
      {sidebarViewMode === 'list' ? (
        <ScrollArea className="flex-1 shadow-inner">
          {allSnippets.length === 0 && isLoading ? (
            <ListSkeleton />
          ) : allSnippets.length === 0 ? (
            <EmptyState
              className="min-h-full"
              title={t('list.noSnippets')}
              description={t('list.noSnippetsDescription')}
              action={
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/new-snippet')}
                >
                  <Plus className="size-4" />
                  {t('common.create')} {t('common.snippet')}
                </Button>
              }
            />
          ) : (
            listOfSnippets.length > 0 &&
            listOfSnippets.map((snippet) => <LazyListItem key={snippet.id} snippet={snippet} />)
          )}
        </ScrollArea>
      ) : sidebarViewMode === 'tags' ? (
        <TreeView key={`tags-${allExpanded}`} mode="tags" allExpanded={allExpanded} />
      ) : (
        <TreeView key={`languages-${allExpanded}`} mode="languages" allExpanded={allExpanded} />
      )}
      <SnippetsListFooter
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        refresh={refresh}
        filteredCount={listOfSnippets.length}
        totalCount={allSnippets.length}
        totalSnippetCount={totalSnippetCount}
        apiRateLimits={apiRateLimits}
      />
    </div>
  );
};
