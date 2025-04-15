import { useRouter } from 'dirty-react-router';
import {
  ShieldCheck,
  Shield,
  Star,
  Calendar,
  File,
  MessageSquareText,
  Pencil,
  Trash,
} from 'lucide-react';

import { toast } from '@/components/toast';
import { Badge } from '@/components/ui/badge.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { GithubApi } from '@/lib/github-api.ts';
import { t } from '@/lib/i18n';
import { globalState, useStoreValue } from '@/lib/store/globalState.ts';
import { cn, fetchAndUpdateSnippets, getTags, removeTags, upperCaseFirst } from '@/lib/utils';
import { GistEnrichedType } from '@/types/gist.ts';

export const ListItem = ({ gist }: { gist: GistEnrichedType }) => {
  const search = useStoreValue('search');
  const { navigate, path } = useRouter();

  const active = path === `/snippets/${gist.id}`;

  const badges = getTags(gist.description);

  return (
    <div
      className={cn(
        'border-b p-4 cursor-pointer',
        active && 'bg-secondary',
        'hover:bg-linear-to-r hover:to-50% hover:from-primary/10 dark:hover:from-primary-950 transition-all ease-in-out duration-300'
      )}
      onClick={() => navigate(`/snippets/${gist.id}`)}
    >
      <div
      //  className="hover:scale-95 transition"
      >
        <h4 className="cursor-pointer">{removeTags(gist.description) || t('common.untitled')}</h4>

        <div className="flex items-center mt-2 gap-2">
          <div className="flex flex-wrap gap-2 mb-4 pr-4">
            {gist.languages.map((language) => {
              const filter = `lang:${language.name.toLowerCase()}`;

              return (
                <Badge
                  key={language.name}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    globalState.setState({ search: filter === search ? '' : filter });
                  }}
                  variant={search === filter ? 'default' : 'primary-outline'}
                  className="whitespace-nowrap cursor-pointer"
                >
                  <div
                    className="w-2 h-2 rounded-full border mr-2"
                    style={{ background: language.color }}
                  />{' '}
                  {language.name}
                </Badge>
              );
            })}

            {badges.length > 0 &&
              badges.map((tag) => {
                const filter = `tag:${tag.replace('#', '')}`;

                return (
                  <Badge
                    key={tag}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      globalState.setState({ search: filter === search ? '' : filter });
                    }}
                    variant={search === filter ? 'default' : 'primary-outline'}
                    className="whitespace-nowrap cursor-pointer"
                  >
                    {tag}
                  </Badge>
                );
              })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="size-3" />
            <span className="text-xs text-zinc-400">
              {
                // TODO: get locale date formating?
                new Date(gist.createdAt).toDateString()
              }
            </span>
          </div>

          <div className="flex items-center">
            {gist.comments.edges.length > 0 && (
              <>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <MessageSquareText className="size-3" />{' '}
                      <span className="text-xs">{gist.comments.edges.length}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('list.snippetHas')} {gist.comments.edges.length}{' '}
                    {gist.comments.edges.length === 1 ? t('common.comment') : t('common.comments')}
                  </TooltipContent>
                </Tooltip>
                <Separator orientation="vertical" className="mx-2 h-4! bg-muted" />
              </>
            )}

            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <File strokeWidth={1.5} className="size-3" />{' '}
                  <span className="text-xs">{Object.keys(gist.files).length}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {t('list.snippetHas')} {Object.keys(gist.files).length}{' '}
                {Object.keys(gist.files).length === 1 ? t('common.file') : t('common.files')}
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-2 h-4! bg-muted" />

            {gist.isPublic ? (
              <>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <div>
                      <Shield
                        onClick={async (event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          const confirmation = confirm(
                            t('list.sureToChangeVisibility', {
                              name: removeTags(gist.description).trim(),
                              visibility: t('common.private'),
                            })
                          );
                          if (confirmation) {
                            await GithubApi.toggleGistVisibility(gist.id);
                            await fetchAndUpdateSnippets();
                          }
                        }}
                        strokeWidth={1.5}
                        className="size-3 cursor-pointer hover:text-primary stroke-danger"
                      />
                      <span className="sr-only">Lock</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {upperCaseFirst(t('common.public'))} {t('common.snippet')}
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <div>
                      <ShieldCheck
                        onClick={async (event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          const confirmation = confirm(
                            t('list.sureToChangeVisibility', {
                              name: removeTags(gist.description).trim(),
                              visibility: t('common.public'),
                            })
                          );

                          if (confirmation) {
                            await GithubApi.toggleGistVisibility(gist.id);
                            await fetchAndUpdateSnippets();
                          }
                        }}
                        strokeWidth={1.5}
                        className="size-3 cursor-pointer hover:text-primary stroke-success"
                      />
                      <span className="sr-only">Unlock</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {upperCaseFirst(t('common.private'))} {t('common.snippet')}
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            {gist.starred ? (
              <>
                <Separator orientation="vertical" className="mx-2 h-4! bg-muted" />
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Star
                      strokeWidth={1.5}
                      className="size-3 stroke-primary cursor-pointer hover:stroke-primary fill-primary hover:scale-125 transition-all"
                      onClick={async (event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        await GithubApi.deleteStar(gist.id);
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {upperCaseFirst(t('common.starred'))} {t('common.snippet')}
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
              <>
                <Separator orientation="vertical" className="mx-2 h-4! bg-muted" />
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Star
                      strokeWidth={1.5}
                      className="size-3 cursor-pointer hover:stroke-primary hover:scale-125 transition-all"
                      onClick={async (event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        await GithubApi.addStar(gist.id);
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {upperCaseFirst(t('common.star'))} {t('common.snippet')}
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            <Separator orientation="vertical" className="mx-2 h-4! bg-muted" />

            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Pencil
                  strokeWidth={1.5}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    navigate(`/edit/${gist.id}`);
                  }}
                  className="size-3 cursor-pointer hover:stroke-primary hover:scale-125 transition-all"
                />
              </TooltipTrigger>
              <TooltipContent>
                {upperCaseFirst(t('common.edit'))} {t('common.snippet')}
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-2 h-4! bg-muted" />

            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Trash
                  strokeWidth={1.5}
                  onClick={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const confirmation = confirm(
                      t('list.sureToDelete', { description: removeTags(gist.description).trim() })
                    );

                    if (confirmation) {
                      const value = await GithubApi.deleteGist(gist.id, false);

                      if (value.success) {
                        toast.info({ message: t('list.snippetDeleted') });
                      }
                    }
                  }}
                  className="size-3 cursor-pointer hover:stroke-danger hover:scale-125 transition-all"
                />
              </TooltipTrigger>
              <TooltipContent>
                {upperCaseFirst(t('common.delete'))} {t('common.snippet')}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
