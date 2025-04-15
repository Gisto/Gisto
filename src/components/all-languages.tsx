import { useState } from 'react';

import { Badge } from '@/components/ui/badge.tsx';
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
import { upperCaseFirst } from '@/lib/utils';

export const AllLanguages = ({
  className,
  active,
  onClick,
}: {
  className?: string;
  onClick?: (l: string) => void;
  active?: string;
}) => {
  const [search, setSearch] = useState('');
  const list = useStoreValue('snippets');
  const allLanguages = list.map((snippet) => snippet.languages).flat();

  const languagesData = Array.from(new Set(allLanguages.map((lang) => lang.name)))
    .filter((lang) => lang.toLowerCase().includes(search.toLowerCase()))
    .map((name) => {
      const language = allLanguages.find((lang) => lang.name === name);
      const count = allLanguages.filter((lang) => lang.name === name).length;
      return { language, count };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>{upperCaseFirst(t('common.languages'))}</div>{' '}
          <div>
            <Input
              type="search"
              placeholder={t('components.filterLanguages', { number: languagesData.length })}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </CardTitle>
        <CardDescription>{t('components.allUniqueLanguages')}</CardDescription>
      </CardHeader>
      <CardContent>
        {languagesData.length === 0 ? (
          <div className="text-center">
            <p>{t('components.noLanguageMatching', { search })}</p>
          </div>
        ) : (
          languagesData.map(({ language, count }) => (
            <Badge
              onClick={() => onClick && onClick(language?.name as string)}
              key={language?.name}
              variant={
                active === 'lang:' + language?.name?.toLowerCase() ? 'default' : 'primary-outline'
              }
              className="m-1 cursor-pointer hover:opacity-70"
            >
              <div className="w-2 h-2 rounded-full mr-2" style={{ background: language?.color }} />{' '}
              {language?.name} <small className="ml-1">({count})</small>
            </Badge>
          ))
        )}
      </CardContent>
    </Card>
  );
};
