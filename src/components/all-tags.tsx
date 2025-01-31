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
import { useStoreValue } from '@/lib/store/globalState.ts';
import { fetchAndUpdateSnippets } from '@/lib/utils.ts';

export const AllTags = ({
  onClick,
  allowCreate = false,
}: {
  onClick?: (t: string) => void;
  allowCreate?: boolean;
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

  // this is extracted like that in order to get easy count
  const tags = [...new Set(allTags)]
    .filter((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    .map((tag) => ({
      tag,
      count: allTags.filter((t) => t === tag).length,
    }))
    .sort((a, b) => b.count - a.count)
    .map(({ tag, count }) => (
      <Badge
        key={tag}
        variant="primary-outline"
        className="m-1 cursor-pointer hover:opacity-70"
        onClick={() => onClick && onClick(tag)}
      >
        {tag} <small className="ml-1">({count})</small>
      </Badge>
    ));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>
            Tags <small>({tags.length})</small>
          </div>{' '}
          <div>
            <Input
              type="search"
              placeholder={`Filter ${tags.length} tags`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </CardTitle>
        <CardDescription>All, unique tags</CardDescription>
      </CardHeader>
      <CardContent>
        {tags.length === 0 ? (
          <div className="text-center">
            <p>{`No tags matching ${search}`}</p>
            {allowCreate && (
              <Button
                className="mt-2"
                variant="outline"
                size="sm"
                onClick={() => onClick && onClick(`#${search}`)}
              >{`Create "#${search}" tag`}</Button>
            )}
          </div>
        ) : (
          tags
        )}
      </CardContent>
    </Card>
  );
};
