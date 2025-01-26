import { useRouter } from 'dirty-react-router';
import {
  ShieldCheck,
  Shield,
  Star,
  Calendar,
  SquareArrowOutUpRight,
  FileCode,
  MessageSquareText,
  Pencil,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { GithubAPI } from '@/lib/GithubApi.ts';
import { cn, getTags, removeTags } from '@/lib/utils.ts';
import { GistEnrichedType } from '@/types/gist.ts';

export const ListItem = ({
  gist,
  search,
  setSearch,
}: {
  gist: GistEnrichedType;
  search?: string;
  setSearch?: (s: string) => void;
}) => {
  const { navigate, path } = useRouter();

  const active = path === `/snippets/${gist.id}`;

  const badges = getTags(gist.description);

  return (
    <div
      className={cn(
        'border-b p-4 hover:border-l-primary hover:border-l-4 transform transition-all',
        active && 'bg-secondary'
      )}
    >
      <h4 className="cursor-pointer" onClick={() => navigate(`/snippets/${gist.id}`)}>
        {removeTags(gist.description) || 'Untitled'}
      </h4>
      {
        <div className="flex items-center mt-2 gap-2">
          <div className="flex flex-wrap gap-2 mb-4 pr-4">
            {gist.languages.map((language) => {
              const filter = `lang:${language.name.toLowerCase()}`;

              return (
                <Badge
                  key={language.name}
                  onClick={() => {
                    if (setSearch) {
                      setSearch(filter === search ? '' : filter);
                    }
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
                    onClick={() => {
                      if (setSearch) {
                        setSearch(filter === search ? '' : filter);
                      }
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
      }

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="size-3" />
          <span className="text-xs text-zinc-400">{new Date(gist.createdAt).toDateString()}</span>
        </div>

        <div className="flex items-center">
          {gist.comments.edges.length > 0 && (
            <>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-help">
                    <MessageSquareText className="size-3" />{' '}
                    <span className="text-xs">{gist.comments.edges.length}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Snippet has {gist.comments.edges.length}{' '}
                  {gist.comments.edges.length === 1 ? 'comment' : 'comments'}
                </TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="mx-2 h-6" />
            </>
          )}

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                <FileCode strokeWidth={1.5} className="size-3" />{' '}
                <span className="text-xs">{Object.keys(gist.files).length}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Snippet has {Object.keys(gist.files).length}{' '}
              {Object.keys(gist.files).length === 1 ? 'file' : 'files'}
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-2 h-6" />

          {gist.isPublic ? (
            <>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <Shield
                      strokeWidth={1.5}
                      className="size-3 cursor-pointer hover:text-primary stroke-danger"
                    />
                    <span className="sr-only">Lock</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Public snippet</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <ShieldCheck
                      strokeWidth={1.5}
                      className="size-3 cursor-pointer hover:text-primary stroke-success"
                    />
                    <span className="sr-only">Unlock</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Private snippet</TooltipContent>
              </Tooltip>
            </>
          )}

          {gist.starred ? (
            <>
              <Separator orientation="vertical" className="mx-2 h-6" />
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Star
                    strokeWidth={1.5}
                    className="size-3 stroke-primary cursor-pointer hover:stroke-primary fill-primary"
                    onClick={async () => await GithubAPI.deleteStar(gist.id)}
                  />
                </TooltipTrigger>
                <TooltipContent>Starred snippet</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <Separator orientation="vertical" className="mx-2 h-6" />
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Star
                    strokeWidth={1.5}
                    className="size-3 cursor-pointer hover:stroke-primary"
                    onClick={async () => await GithubAPI.addStar(gist.id)}
                  />
                </TooltipTrigger>
                <TooltipContent>Not starred snippet</TooltipContent>
              </Tooltip>
            </>
          )}

          <Separator orientation="vertical" className="mx-2 h-6" />

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Pencil
                strokeWidth={1.5}
                onClick={() => navigate(`/edit/${gist.id}`)}
                className="size-3 cursor-pointer hover:stroke-primary"
              />
            </TooltipTrigger>
            <TooltipContent>Edit snippet</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-2 h-6" />

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <SquareArrowOutUpRight
                strokeWidth={1.5}
                onClick={() => navigate(`/snippets/${gist.id}`)}
                className="size-3 cursor-pointer hover:stroke-primary"
              />
            </TooltipTrigger>
            <TooltipContent>View snippet</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
