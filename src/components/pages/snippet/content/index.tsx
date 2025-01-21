import { Lock, Pencil, MoreVertical, Star, Trash, Globe, ExternalLink, Copy } from 'lucide-react';

import { useEffect, useState } from 'react';

import { useRouter } from 'dirty-react-router';

import { Badge } from '@/components/ui/badge.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { PageHeader } from '@/components/layout/page-header.tsx';
import { copyToClipboard, getTags, removeTags } from '@/lib/utils.ts';
import { GistType } from '@/types/gist.ts';
import { SnippetFile } from '@/components/pages/snippet/content/snippet-file.tsx';
import { GithubAPI } from '@/lib/GithubApi.ts';
import { Loading } from '@/components/Loading.tsx';

export const SnippetContent = () => {
  const [snippet, setSnippet] = useState<GistType | null>(null);
  const [loading, setLoading] = useState(true);
  const { params, navigate } = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const gist = await GithubAPI.getGist(params.id);

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

            <Button variant="ghost" size="icon" className="-mx-3">
              <Pencil className="size-4" />
              <span className="sr-only">Edit</span>
            </Button>

            <Separator orientation="vertical" className="mx-2 h-6" />

            <Button variant="ghost" size="icon" className="-mx-3">
              <Lock className="size-4" />
              <span className="sr-only">Lock</span>
            </Button>

            <Separator orientation="vertical" className="mx-2 h-6" />

            <Button variant="ghost" size="icon" className="-mx-3">
              <Star className="size-4" />
              <span className="sr-only">Star</span>
            </Button>

            <Separator orientation="vertical" className="mx-2 h-6" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="">
                <Button variant="ghost" size="icon" className="-ml-3">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    window.open(snippet.html_url);
                  }}
                >
                  <Globe /> Open on web
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyToClipboard(snippet.id)}>
                  <Copy /> Copy snippet ID
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    window.open(`https://plnkr.co/edit/gist:${snippet?.id}?preview`);
                  }}
                >
                  <ExternalLink /> Open in <strong>plnkr</strong>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    window.open(`https://jsfiddle.net/gh/gist/library/pure/${snippet?.id}`);
                  }}
                >
                  <ExternalLink /> Open in <strong>jsfiddle</strong>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => {
                  const value = await GithubAPI.deleteGist(snippet.id);

                  if (value.success) {
                    navigate('/');
                  }
                }}>
                  <Trash /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </PageHeader>
      <div className="bg-secondary h-full">
        <div className="p-4 overflow-y-scroll h-full pb-10">
          {Object.keys(snippet.files).map((file) => {
            return <SnippetFile key={file} snippet={snippet} file={snippet.files[file]} />;
          })}
        </div>
      </div>
    </div>
  );
};
