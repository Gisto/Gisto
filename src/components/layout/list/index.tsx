import React, { useCallback, useState } from 'react';
import { FileCode, Filter, Loader, Search, SidebarClose, SidebarOpen } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { PageHeader } from '@/components/layout/page-header.tsx';
import { ListItem } from '@/components/layout/list/item.tsx';

import { GistEnrichedType } from '@/types/gist.ts';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { useSnippets } from '@/hooks/use-snippets.tsx';
import useIntersectionObserver from '@/hooks/use-intersection-observer.tsx';
import { Loading } from '@/components/Loading.tsx';

const LazyListItem = ({
  gist,
  search,
  setSearch,
}: {
  gist: GistEnrichedType;
  search?: string;
  setSearch?: (s: string) => void;
}) => {
  const [isInView, ref] = useIntersectionObserver<HTMLDivElement>();

  return (
    <div ref={ref}>
      {isInView ? (
        <ListItem search={search} setSearch={setSearch} gist={gist} />
      ) : (
        <div className="h-[80px]" />
      )}
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
  const [search, setSearch] = useState<string>('');
  const { isLoading } = useSnippets();
  const currentSnippets = useStoreValue('snippets');
  const apiRateLimits = useStoreValue('apiRateLimits');

  const handleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed, setIsCollapsed]);

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  const listOfSnippets = () => {
    return search !== '' && search.length > 0
      ? currentSnippets.filter(
          (listItem) => listItem.description.trim() && listItem.description.includes(search.trim())
        )
      : currentSnippets;
  };

  if (!listOfSnippets()) {
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
            placeholder={`Search ${listOfSnippets().length} gists`}
            className="pl-8 w-full"
            type="search"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <Button variant="ghost" size="icon">
          <Filter className="size-4" />
        </Button>
      </PageHeader>
      <div className="h-[calc(100vh-104px)] overflow-auto shadow-inner">
        {currentSnippets.length === 0 ? (
          <Loading />
        ) : (
          listOfSnippets().length > 0 &&
          listOfSnippets().map((gist) => (
            <LazyListItem search={search} setSearch={setSearch} key={gist.id} gist={gist} />
          ))
        )}
      </div>
      <div className="h-[52px] border-t flex items-center justify-between p-4 gap-2 text-xs">
        <div className="flex items-center gap-2">
          {!isLoading ? (
            <>
              <FileCode className="size-4" /> {listOfSnippets().length} of {currentSnippets.length}{' '}
              Snippets
            </>
          ) : (
            <>
              <Loader className="animate-spin size-3" /> Refreshing data
            </>
          )}
        </div>
        <div>
          {apiRateLimits && (
            <Tooltip>
              <TooltipTrigger>
                API Rate limit: {apiRateLimits.remaining}/{apiRateLimits.limit}
              </TooltipTrigger>
              <TooltipContent>
                GitHub API rate limit, {apiRateLimits.limit}/hour Next reset: {apiRateLimits.reset}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};
