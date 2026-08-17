import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState';

const ChartSkeleton = () => (
  <Card className="flex h-full flex-col">
    <CardHeader>
      <div className="h-5 w-40 bg-foreground/10 rounded animate-pulse" />
    </CardHeader>
    <CardContent>
      <div className="h-[240px] bg-foreground/10 rounded animate-pulse" />
    </CardContent>
  </Card>
);

export const FilesPerSnippet = () => {
  const list = useStoreValue('snippets');
  const totalSnippetCount = useStoreValue('totalSnippetCount');

  const isLoading = !list || (list.length === 0 && totalSnippetCount === 0);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (!list || list.length === 0) return null;

  const filesDistribution = list.reduce(
    (acc, snippet) => {
      const count = snippet.files.length;
      acc[count] = (acc[count] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );
  const filesPerSnippetData = Object.entries(filesDistribution)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([files, count], index) => ({
      name: `${files}`,
      count,
      fill: `var(--chart-${(index % 12) + 1})`,
    }));

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base text-foreground">
          {t('pages.dashboard.filesPerSnippet')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[280px] w-full">
          <BarChart accessibilityLayer layout="vertical" data={filesPerSnippetData}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={40}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
            />
            <Bar dataKey="count" barSize={8} radius={[0, 6, 6, 0]}>
              {filesPerSnippetData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
