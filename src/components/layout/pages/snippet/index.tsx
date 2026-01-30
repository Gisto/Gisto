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
import { t } from '@/lib/i18n';
import { snippetService } from '@/lib/providers/snippet-service.ts';
import { globalState, useStoreValue } from '@/lib/store/globalState.ts';
import {
  copyToClipboard,
  fetchAndUpdateSnippets,
  getTags,
  removeTags,
  upperCaseFirst,
} from '@/lib/utils';
import { GistSingleType } from '@/types/gist.ts';

export const SnippetContent = () => {
  const [snippet, setSnippet] = useState<GistSingleType | null>(null);
  const [loading, setLoading] = useState(true);
  const { params, navigate } = useRouter();
  const snippetState = useStoreValue('snippets').find((s) => s.id === params.id);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const fetchData = async () => {
      const gist = await snippetService.getGist(params.id);

      setSnippet(gist);
      setLoading(false);
    };

    if (params.id) {
      void fetchData();
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
            <div className="line-clamp-1">
              {removeTags(snippet.description) || t('common.untitled')}
            </div>

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
              <span className="sr-only">{upperCaseFirst(t('common.edit'))}</span>
            </Button>

            <Separator orientation="vertical" className="mx-2 h-6" />

            {snippetState && snippetState.isPublic ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={async () => {
                      const confirmation = await confirm(
                        t('list.sureToChangeVisibility', {
                          name: removeTags(snippet.description),
                          visibility: t('common.private'),
                        })
                      );

                      if (confirmation) {
                        await snippetService.toggleGistVisibility(snippet.id);
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
                <TooltipContent>
                  {upperCaseFirst(t('common.public'))} {t('common.snippet')}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={async () => {
                      const confirmation = await confirm(
                        t('list.sureToChangeVisibility', {
                          name: removeTags(snippet.description),
                          visibility: t('common.public'),
                        })
                      );

                      if (confirmation) {
                        await snippetService.toggleGistVisibility(snippet.id);
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
                <TooltipContent>
                  {upperCaseFirst(t('common.private'))} {t('common.snippet')}
                </TooltipContent>
              </Tooltip>
            )}

            <Separator orientation="vertical" className="mx-2 h-6" />
            {snippetService.capabilities.supportsStars && (
              <>
                {snippetState && snippetState.starred ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-mx-3"
                    onClick={async () => await snippetService.deleteStar(snippet.id)}
                  >
                    <Star className="size-4 fill-primary stroke-primary" />
                    <span className="sr-only">{upperCaseFirst(t('common.starred'))}</span>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-mx-3"
                    onClick={async () => await snippetService.addStar(snippet.id)}
                  >
                    <Star className="size-4" />
                    <span className="sr-only">{upperCaseFirst(t('common.star'))}</span>
                  </Button>
                )}

                <Separator orientation="vertical" className="mx-2 h-6" />
              </>
            )}

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
                    <Globe /> {upperCaseFirst(t('pages.snippet.openOnWeb'))}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyToClipboard(snippet.id)}>
                  <Copy /> {t('pages.snippet.copySnippetId')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    copyToClipboard(
                      `<script src="https://gist.github.com/${globalState.getState()?.user?.login ?? ''}/${snippet.id}.js"></script>`
                    )
                  }
                >
                  <Copy /> {t('pages.snippet.copyEmbed')}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    className="cursor-pointer"
                    href={`https://plnkr.co/edit/gist:${snippet?.id}?preview`}
                    target="_blank"
                  >
                    <ExternalLink /> {t('pages.snippet.openIn')} <strong>plnkr</strong>
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <a
                    className="cursor-pointer"
                    href={`https://jsfiddle.net/gh/gist/library/pure/${snippet?.id}`}
                    target="_blank"
                  >
                    <ExternalLink /> {t('pages.snippet.openIn')} <strong>jsfiddle</strong>{' '}
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Info strokeWidth={1.5} className="size-3 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent align="end">
                        {t('pages.snippet.jsfiddleInstructions')}
                      </TooltipContent>
                    </Tooltip>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-danger"
                  onClick={async () => {
                    const confirmation = await confirm(
                      t('list.sureToDelete', {
                        description: removeTags(snippet.description),
                      })
                    );

                    if (confirmation) {
                      const value = await snippetService.deleteGist(snippet.id);

                      if (value.success) {
                        navigate('/');
                      }
                    }
                  }}
                >
                  <Trash /> {upperCaseFirst(t('common.delete'))}{' '}
                  <small>({t('pages.snippet.cannotBeUndone')})</small>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </PageHeader>
      <div className="bg-secondary h-full shadow-inner">
        <ScrollArea className="h-full pb-10">
          <div className="p-4">
            {Object.keys(snippet.files)
              .sort((a, b) => {
                const sortByMarkdownFirst =
                  globalState.getState()?.settings?.sortFilesByMarkdownFirst;

                if (sortByMarkdownFirst) {
                  const isMarkdownA = a.endsWith('.md') || snippet.files[a].language === 'Markdown';
                  const isMarkdownB = b.endsWith('.md') || snippet.files[b].language === 'Markdown';
                  if (isMarkdownA && !isMarkdownB) return -1;
                  if (!isMarkdownA && isMarkdownB) return 1;
                }

                return 0;
              })
              .map((file) => {
                return <File key={file} snippet={snippet} file={snippet.files[file]} />;
              })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
