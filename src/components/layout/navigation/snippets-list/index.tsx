import { FileCode, Filter, FilterX, RefreshCcw, SidebarClose, SidebarOpen } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { ListItem } from '@/components/layout/navigation/snippets-list/item.tsx';
import { SearchInput } from '@/components/layout/navigation/snippets-list/search-input.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { Loading } from '@/components/loading.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import useIntersectionObserver from '@/hooks/use-intersection-observer.tsx';
import { useSnippets } from '@/hooks/use-snippets.tsx';
import { t } from '@/lib/i18n';
import { globalState, useStoreValue } from '@/lib/store/globalState.ts';
import { searchFilter } from '@/lib/utils';
import { SnippetEnrichedType } from '@/types/snippet.ts';
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

export const Lists = ({
  setIsCollapsed,
  isCollapsed,
}: {
  setIsCollapsed: (b: boolean) => void;
  isCollapsed: boolean;
}) => {
  const { isLoading, refresh } = useSnippets();
  const allSnippets = useStoreValue('snippets');
  const search = useStoreValue('search');
  const apiRateLimits = useStoreValue('apiRateLimits');

  const handleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed, setIsCollapsed]);

  // Memoize filtered results using only the debounced global search
  const listOfSnippets = useMemo(() => {
    return searchFilter(search, allSnippets);
  }, [search, allSnippets]);

  if (!listOfSnippets) {
    return null;
  }

  return (
    <div className="flex flex-col gap-0">
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

        <Button
          disabled={!search}
          variant="ghost"
          size="icon"
          onClick={() => {
            globalState.setState({ search: '' });
          }}
        >
          {search ? <FilterX className="size-4" /> : <Filter className="size-4" />}
        </Button>
      </PageHeader>
      <ScrollArea className="h-[calc(100dvh_-_104px)] shadow-inner">
        {allSnippets.length === 0 ? (
          <ListSkeleton />
        ) : (
          listOfSnippets.length > 0 &&
          listOfSnippets.map((snippet) => <LazyListItem key={snippet.id} snippet={snippet} />)
        )}
      </ScrollArea>
      <div className="h-[52px] border-t flex items-center justify-between p-4 gap-2 text-[10px]">
        <div className="flex items-center gap-2">
          {!isLoading ? (
            <>
              <FileCode className="size-3" />{' '}
              {t('list.filteredSnippets', {
                filtered: listOfSnippets.length,
                number: allSnippets.length,
              })}
            </>
          ) : (
            <>
              <Loading size={3} className="flex items-center justify-center mr-1" />{' '}
              {t('list.refreshingData')}
            </>
          )}

          {!isLoading && (
            <Tooltip>
              <TooltipTrigger>
                <RefreshCcw className="size-3 cursor-pointer" onClick={refresh} />
              </TooltipTrigger>
              <TooltipContent>{t('list.refreshTheList')}</TooltipContent>
            </Tooltip>
          )}
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
    </div>
  );
};
