import {
  FileCode,
  Filter,
  FilterX,
  RefreshCcw,
  Search,
  SidebarClose,
  SidebarOpen,
  Loader,
  Info,
} from 'lucide-react';
import React, { useCallback } from 'react';

import { ListItem } from '@/components/layout/navigation/snippets-list/item.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import useIntersectionObserver from '@/hooks/use-intersection-observer.tsx';
import { useSnippets } from '@/hooks/use-snippets.tsx';
import { t } from '@/lib/i18n';
import { globalState, useStoreValue } from '@/lib/store/globalState.ts';
import { searchFilter } from '@/lib/utils';
import { GistEnrichedType } from '@/types/gist.ts';
const LazyListItem = ({ gist }: { gist: GistEnrichedType }) => {
  const [isInView, ref] = useIntersectionObserver<HTMLDivElement>();

  return <div ref={ref}>{isInView ? <ListItem gist={gist} /> : <div className="h-[80px]" />}</div>;
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

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    globalState.setState({ search: event.target.value });
  }, []);

  const listOfSnippets = searchFilter(search, allSnippets);

  if (!listOfSnippets) {
    return null;
  }

  return (
    <div className="flex flex-col gap-0">
      <PageHeader>
        <Button variant="ghost" size="icon" onClick={handleCollapse}>
          {!isCollapsed ? <SidebarClose className="size-4" /> : <SidebarOpen className="size-4" />}
        </Button>
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('list.searchSnippets', { number: allSnippets.length })}
            className="pl-8 w-full"
            type="search"
            value={search}
            onChange={handleSearch}
          />
          {!search && (
            <Tooltip>
              <TooltipTrigger className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground">
                <Info className="size-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent align="start">
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: t('list.searchHelp.title') }}
                />
                <br />
                <div
                  className="text-xs mb-2"
                  dangerouslySetInnerHTML={{ __html: t('list.searchHelp.description') }}
                />
                <div
                  className="text-xs mb-2"
                  dangerouslySetInnerHTML={{ __html: t('list.searchHelp.tags') }}
                />
                <div
                  className="text-xs mb-2"
                  dangerouslySetInnerHTML={{ __html: t('list.searchHelp.language') }}
                />
                <div
                  className="text-xs mb-2"
                  dangerouslySetInnerHTML={{ __html: t('list.searchHelp.stars') }}
                />
                <div
                  className="text-xs mb-2"
                  dangerouslySetInnerHTML={{ __html: t('list.searchHelp.visibility') }}
                />
                <div
                  className="text-xs mb-2"
                  dangerouslySetInnerHTML={{ __html: t('list.searchHelp.untagged') }}
                />
                <Separator className="mt-4 mb-2" />
                <div className="flex gap-2 items-center">{t('list.searchHelp.tip')}</div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <Button
          disabled={!search}
          variant="ghost"
          size="icon"
          onClick={() => globalState.setState({ search: '' })}
        >
          {search ? <FilterX className="size-4" /> : <Filter className="size-4" />}
        </Button>
      </PageHeader>
      <ScrollArea className="h-[calc(100dvh_-_104px)] shadow-inner">
        {allSnippets.length === 0 ? (
          <ListSkeleton />
        ) : (
          listOfSnippets.length > 0 &&
          listOfSnippets.map((gist) => <LazyListItem key={gist.id} gist={gist} />)
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
              <Loader className="animate-spin size-3" /> {t('list.refreshingData')}
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
