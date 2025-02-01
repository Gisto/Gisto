import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { useStoreValue } from '@/lib/store/globalState.ts';

export const CardsCharts = () => {
  const list = useStoreValue('snippets');

  const cardCharts = [
    {
      title: 'Public / Private',
      value: `${list.filter((snippet) => snippet.isPublic).length}/${list.filter((snippet) => !snippet.isPublic).length}`,
      description: `Private and public of ${list.length} snippets`,
    },
    {
      title: 'Starred',
      value: list.filter((snippet) => snippet.starred).length,
      description: `Starred snippets among ${list.length}`,
    },
    {
      title: 'Untagged',
      value: list.filter((snippet) => snippet.tags.length === 0).length,
      description: `Snippets with no tags`,
    },
    {
      title: 'Untitled',
      value: list.filter(
        (snippet) => snippet.isUntitled || snippet.description.trim().toLowerCase() === 'untitled'
      ).length,
      description: `Snippets with no description`,
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
