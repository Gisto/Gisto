import { Cell, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState';

const ChartSkeleton = () => (
  <Card className="flex-1">
    <CardHeader>
      <div className="h-5 w-32 bg-foreground/10 rounded animate-pulse" />
    </CardHeader>
    <CardContent>
      <div className="h-[240px] bg-foreground/10 rounded animate-pulse" />
    </CardContent>
  </Card>
);

export const Insights = () => {
  const list = useStoreValue('snippets');
  const totalSnippetCount = useStoreValue('totalSnippetCount');

  const isLoading = !list || (list.length === 0 && totalSnippetCount === 0);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (!list || list.length === 0) return null;

  const tags = list.reduce(
    (acc, snippet) => {
      snippet.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );
  const topTags = Object.entries(tags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count], index) => ({
      name: name.length > 10 ? name.substring(0, 10) + '...' : name,
      count,
      fill: `var(--chart-${(index % 12) + 1})`,
    }));

  const totalTagUsages = topTags.reduce((acc, tag) => acc + tag.count, 0);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base text-foreground">{t('pages.dashboard.topTags')}</CardTitle>
      </CardHeader>
      <CardContent className="relative flex flex-1 items-center justify-center">
        <ChartContainer config={{}} className="h-[240px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={topTags}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={1.5}
              strokeWidth={0}
              cornerRadius={4}
            >
              {topTags.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-numbers text-3xl font-bold text-foreground">{totalTagUsages}</span>
          <span className="text-xs text-muted-foreground">{t('common.tags')}</span>
        </div>
      </CardContent>
    </Card>
  );
};
