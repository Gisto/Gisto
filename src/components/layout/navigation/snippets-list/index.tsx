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
  Lightbulb,
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
            placeholder={`Search ${listOfSnippets.length} gists`}
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
                <div className="text-sm">
                  <h4 className="mb-3">
                    Search for snippets by description/title, tags or language
                    <br />
                    Or a combinations of all:
                  </h4>
                  <div className="text-xs mb-2">
                    <strong>Description or files contents:</strong>{' '}
                    <code className="bg-muted-foreground dark:bg-accent rounded p-1">
                      just free text
                    </code>
                  </div>
                  <div className="text-xs mb-2">
                    <strong>Tags:</strong>{' '}
                    <code className="bg-muted-foreground dark:bg-accent rounded p-1">
                      tag:{'<your-search>'}
                    </code>
                  </div>
                  <div className="text-xs mb-2">
                    <strong>Language:</strong>{' '}
                    <code className="bg-muted-foreground dark:bg-accent rounded p-1">
                      lang:{'<your-search>'}
                    </code>
                  </div>

                  <div className="text-xs mb-2">
                    <strong>Stars:</strong>{' '}
                    <code className="bg-muted-foreground dark:bg-accent rounded p-1">
                      is:starred
                    </code>{' '}
                    or{' '}
                    <code className="bg-muted-foreground dark:bg-accent rounded p-1">
                      is:unstarred
                    </code>
                  </div>

                  <div className="text-xs mb-2">
                    <strong>Visibility:</strong>{' '}
                    <code className="bg-muted-foreground dark:bg-accent rounded p-1">
                      is:private
                    </code>{' '}
                    or{' '}
                    <code className="bg-muted-foreground dark:bg-accent rounded p-1">
                      is:public
                    </code>
                  </div>

                  <div className="text-xs mb-2">
                    <strong>Un-tagged snippets:</strong>{' '}
                    <code className="bg-muted-foreground dark:bg-accent rounded p-1">
                      is:untagged
                    </code>
                  </div>
                  <Separator className="mt-4 mb-2" />
                  <small className="flex gap-2 items-center">
                    <Lightbulb className="size-4 text-yellow-400" /> You can also just click a tag
                    or a language
                  </small>
                </div>
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
      <ScrollArea className="h-[calc(100vh-104px)] shadow-inner">
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
              <FileCode className="size-3" /> {listOfSnippets.length} of {allSnippets.length}{' '}
              Snippets
            </>
          ) : (
            <>
              <Loader className="animate-spin size-3" /> Refreshing data
            </>
          )}

          {!isLoading && (
            <Tooltip>
              <TooltipTrigger>
                <RefreshCcw className="size-3 cursor-pointer" onClick={refresh} />
              </TooltipTrigger>
              <TooltipContent>Refresh the list</TooltipContent>
            </Tooltip>
          )}
        </div>
        <div>
          {apiRateLimits && (
            <Tooltip>
              <TooltipTrigger>
                API rate: {apiRateLimits.remaining}/{apiRateLimits.limit}
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
