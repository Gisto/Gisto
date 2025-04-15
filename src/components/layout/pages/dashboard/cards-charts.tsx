import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { upperCaseFirst } from '@/lib/utils';

export const CardsCharts = () => {
  const list = useStoreValue('snippets');

  const cardCharts = [
    {
      title: `${upperCaseFirst(t('common.public'))} / ${upperCaseFirst(t('common.private'))}`,
      value: `${list.filter((snippet) => snippet.isPublic).length}/${list.filter((snippet) => !snippet.isPublic).length}`,
      description: t('pages.dashboard.publicAndPrivateNumbers', { number: list.length }),
    },
    {
      title: upperCaseFirst(t('common.starred')),
      value: list.filter((snippet) => snippet.starred).length,
      description: t('pages.dashboard.starredNumbers', { number: list.length }),
    },
    {
      title: upperCaseFirst(t('common.untagged')),
      value: list.filter((snippet) => snippet.tags.length === 0).length,
      description: t('pages.dashboard.snippetsWithNoTags'),
    },
    {
      title: upperCaseFirst(t('common.untitled')),
      value: list.filter(
        (snippet) => snippet.isUntitled || snippet.description.trim().toLowerCase() === 'untitled'
      ).length,
      description: t('pages.dashboard.snippetsWithNoDescription'),
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
      {cardCharts.map((chart) => (
        <Card key={chart.title}>
          <CardHeader>
            <CardTitle className="text-primary">{chart.title}</CardTitle>
            <CardDescription className="text-foreground text-xs min-h-8">
              {chart.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-primary text-[2.5vw] text-right font-numbers">
            {chart.value}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
