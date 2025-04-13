import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { fetchAndUpdateSnippets, upperCaseFirst } from '@/lib/utils';

const CreateNew = ({
  search,
  allowCreate,
  onClick,
  tagsData,
}: {
  search: string;
  allowCreate: boolean;
  onClick?: () => void;
  tagsData: { tag: string; count: number }[];
}) => {
  if (
    search.length === 0 ||
    (allowCreate &&
      tagsData.some((tag) => {
        return tag.tag.replace('#', '').toLowerCase() === search.toLowerCase();
      }))
  )
    return null;

  if (!allowCreate && tagsData.length > 0) return null;

  return (
    <div className="text-center mb-8">
      <p>{t('components.noTagsMatching', { search })}</p>
      {allowCreate && (
        <Button
          className="mt-2"
          variant="outline"
          size="sm"
          onClick={onClick}
        >{`Create "#${search}" tag`}</Button>
      )}
    </div>
  );
};

export const AllTags = ({
  onClick,
  active,
  allowCreate = false,
  className,
}: {
  onClick?: (t: string) => void;
  active?: string;
  allowCreate?: boolean;
  className?: string;
}) => {
  const [search, setSearch] = useState('');

  const list = useStoreValue('snippets');
  const allTags = list.map((snippet) => snippet.tags).flat();

  useEffect(() => {
    // NOTE:
    // if the list is empty, fetch the snippets
    // Edge case for refresh on the first load while on create new page
    if (list.length === 0) {
      (async () => await fetchAndUpdateSnippets())();
    }
  }, [list]);

  const tagsData = [...new Set(allTags)]
    .filter((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    .map((tag) => ({
      tag,
      count: allTags.filter((t) => t === tag).length,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>
            {upperCaseFirst(t('common.tags'))} <small>({tagsData.length})</small>
          </div>{' '}
          <div>
            <Input
              type="search"
              placeholder={t('components.filterTags', {
                number: tagsData.length,
              })}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </CardTitle>
        <CardDescription>{t('components.allUniqueTags')}</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateNew
          search={search}
          allowCreate={allowCreate}
          onClick={() => {
            setSearch('');
            if (onClick) {
              onClick(`#${search}`);
            }
          }}
          tagsData={tagsData}
        />

        {tagsData.length === 0
          ? null
          : tagsData.map(({ tag, count }) => (
              <Badge
                data-testid={`tag-${tag.replace('#', '')}`}
                key={tag}
                variant={active === 'tag:' + tag.replace('#', '') ? 'default' : 'primary-outline'}
                className="m-1 cursor-pointer hover:opacity-70"
                onClick={() => onClick && onClick(tag)}
              >
                {tag} <small className="ml-1">({count})</small>
              </Badge>
            ))}
      </CardContent>
    </Card>
  );
};
