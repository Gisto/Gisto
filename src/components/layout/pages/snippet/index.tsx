import { useRouter } from 'dirty-react-router';
import {
  Pencil,
  MoreVertical,
  Star,
  Trash,
  Globe,
  ExternalLink,
  Copy,
  ShieldCheck,
  Shield,
  Info,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { File } from '@/components/layout/pages/snippet/content';
import { Loading } from '@/components/loading.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { GithubApi } from '@/lib/github-api.ts';
import { globalState, useStoreValue } from '@/lib/store/globalState.ts';
import { copyToClipboard, fetchAndUpdateSnippets, getTags, removeTags } from '@/lib/utils';
import { GistSingleType } from '@/types/gist.ts';

export const SnippetContent = () => {
  const [snippet, setSnippet] = useState<GistSingleType | null>(null);
  const [loading, setLoading] = useState(true);
  const { params, navigate } = useRouter();
  const snippetState = useStoreValue('snippets').find((s) => s.id === params.id);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const gist = await GithubApi.getGist(params.id);

      setSnippet(gist);
      setLoading(false);
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (loading || !snippet) {
    return <Loading />;
  }

  const badges = getTags(snippet.description);

  return (
    <div className="h-screen w-full border-r border-collapse">
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="line-clamp-1">{removeTags(snippet.description) || 'Untitled'}</div>

            {badges.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  {badges.map((tag) => (
                    <Badge
                      key={tag}
                      variant="primary-outline"
                      className="whitespace-nowrap cursor-pointer hover:text-primary/50 hover:border-primary/50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Separator orientation="vertical" className="mx-2 h-6" />

            <Button
              variant="ghost"
              size="icon"
              className="-mx-3"
              onClick={() => navigate(`/edit/${snippet.id}`)}
            >
              <Pencil className="size-4" />
              <span className="sr-only">Edit</span>
            </Button>

            <Separator orientation="vertical" className="mx-2 h-6" />

            {snippetState && snippetState.isPublic ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={async () => {
                      const confirmation = await confirm(
                        `Are you sure you want to change "${removeTags(snippet.description).trim()}" snippet to private? This snippet will be removed and new one gonna be created instead.`
                      );

                      if (confirmation) {
                        await GithubApi.toggleGistVisibility(snippet.id);
                        navigate('/');
                        await fetchAndUpdateSnippets();
                      }
                    }}
                    variant="ghost"
                    size="icon"
                    className="-mx-3"
                  >
                    <Shield
                      strokeWidth={1.5}
                      className="size-3 cursor-pointer hover:text-primary stroke-danger"
                    />
                    <span className="sr-only">Lock</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Public snippet</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={async () => {
                      const confirmation = await confirm(
                        `Are you sure you want to change "${removeTags(snippet.description).trim()}" snippet to public? This snippet will be removed and new one gonna be created instead.`
                      );

                      if (confirmation) {
                        await GithubApi.toggleGistVisibility(snippet.id);
                        navigate('/');
                        await fetchAndUpdateSnippets();
                      }
                    }}
                    variant="ghost"
                    size="icon"
                    className="-mx-3"
                  >
                    <ShieldCheck
                      strokeWidth={1.5}
                      className="size-3 cursor-pointer hover:text-primary stroke-success"
                    />
                    <span className="sr-only">Lock</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Private snippet</TooltipContent>
              </Tooltip>
            )}

            <Separator orientation="vertical" className="mx-2 h-6" />

            {snippetState && snippetState.starred ? (
              <Button
                variant="ghost"
                size="icon"
                className="-mx-3"
                onClick={async () => await GithubApi.deleteStar(snippet.id)}
              >
                <Star className="size-4 fill-primary stroke-primary" />
                <span className="sr-only">Starred</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="-mx-3"
                onClick={async () => await GithubApi.addStar(snippet.id)}
              >
                <Star className="size-4" />
                <span className="sr-only">Not starred</span>
              </Button>
            )}

            <Separator orientation="vertical" className="mx-2 h-6" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="">
                <Button variant="ghost" size="icon" className="-ml-3">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a className="cursor-pointer" href={snippet.html_url} target="_blank">
                    <Globe /> Open on web
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyToClipboard(snippet.id)}>
                  <Copy /> Copy snippet ID
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    copyToClipboard(
                      `<script src="https://gist.github.com/${globalState.getState()?.user?.login ?? ''}/${snippet.id}.js"></script>`
                    )
                  }
                >
                  <Copy /> Copy embed code to clipboard
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    className="cursor-pointer"
                    href={`https://plnkr.co/edit/gist:${snippet?.id}?preview`}
                    target="_blank"
                  >
                    <ExternalLink /> Open in <strong>plnkr</strong>
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <a
                    className="cursor-pointer"
                    href={`https://jsfiddle.net/gh/gist/library/pure/${snippet?.id}`}
                    target="_blank"
                  >
                    <ExternalLink /> Open in <strong>jsfiddle</strong>{' '}
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Info strokeWidth={1.5} className="size-3 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent align="end">
                        Need to have CSS, JS and HTML files as part of the snippet
                      </TooltipContent>
                    </Tooltip>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-danger"
                  onClick={async () => {
                    const confirmation = await confirm(
                      `Are you sure you want to delete "${removeTags(snippet.description)}" snippet?`
                    );

                    if (confirmation) {
                      const value = await GithubApi.deleteGist(snippet.id);

                      if (value.success) {
                        navigate('/');
                      }
                    }
                  }}
                >
                  <Trash /> Delete <small>(can not be undone)</small>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </PageHeader>
      <div className="bg-secondary h-full shadow-inner">
        <ScrollArea className="h-full pb-10">
          <div className="p-4">
            {Object.keys(snippet.files).map((file) => {
              return <File key={file} snippet={snippet} file={snippet.files[file]} />;
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
