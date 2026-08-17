import { FileText, Globe, Star, Tag } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { t } from '@/lib/i18n';
import { snippetService } from '@/lib/providers/snippet-service.ts';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { upperCaseFirst } from '@/utils';

const CardSkeleton = () => (
  <Card className="flex-1">
    <CardHeader>
      <div className="h-4 w-24 bg-foreground/10 rounded animate-pulse" />
      <div className="h-3 w-full bg-foreground/10 rounded animate-pulse" />
    </CardHeader>
    <CardContent className="flex justify-end">
      <div className="h-8 w-16 bg-foreground/10 rounded animate-pulse" />
    </CardContent>
  </Card>
);

export const CardsCharts = () => {
  const list = useStoreValue('snippets');
  const totalSnippetCount = useStoreValue('totalSnippetCount');

  const isLoading = !list || (list.length === 0 && totalSnippetCount === 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const cardCharts = [
    {
      title: `${upperCaseFirst(t('common.public'))} / ${upperCaseFirst(t('common.private'))}`,
      value: `${list.filter((snippet) => snippet.isPublic).length}/${list.filter((snippet) => !snippet.isPublic).length}`,
      description: t('pages.dashboard.publicAndPrivateNumbers', { number: list.length }),
      icon: Globe,
      show: true,
    },
    {
      title: upperCaseFirst(t('common.starred')),
      value: list.filter((snippet) => snippet.starred).length,
      description: t('pages.dashboard.starredNumbers', { number: list.length }),
      icon: Star,
      show: snippetService.capabilities.supportsStars,
    },
    {
      title: upperCaseFirst(t('common.untagged')),
      value: list.filter((snippet) => snippet.tags.length === 0).length,
      description: t('pages.dashboard.snippetsWithNoTags'),
      icon: Tag,
      show: true,
    },
    {
      title: upperCaseFirst(t('common.untitled')),
      value: list.filter(
        (snippet) => snippet.isUntitled || snippet.description.trim().toLowerCase() === 'untitled'
      ).length,
      description: t('pages.dashboard.snippetsWithNoDescription'),
      icon: FileText,
      show: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cardCharts
        .filter((chart) => chart.show)
        .map((chart) => {
          const Icon = chart.icon;
          return (
            <Card key={chart.title} className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {chart.title}
                </CardTitle>
                <div className="flex size-9 items-center justify-center rounded-lg bg-gold/15 text-gold">
                  <Icon className="size-4" strokeWidth={2} />
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="font-numbers text-4xl font-bold leading-none text-primary">
                  {chart.value}
                </div>
                <CardDescription className="mt-2 min-h-8 text-xs">
                  {chart.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};
