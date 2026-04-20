import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState';

const ChartSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="h-5 w-32 bg-foreground/10 rounded animate-pulse" />
    </CardHeader>
    <CardContent>
      <div className="h-[250px] bg-foreground/10 rounded animate-pulse" />
    </CardContent>
  </Card>
);

export const Insights = () => {
  const list = useStoreValue('snippets');
  const totalSnippetCount = useStoreValue('totalSnippetCount');

  const isLoading = !list || (list.length === 0 && totalSnippetCount === 0);

  if (isLoading) {
    return (
      <div className="mt-8 grid gap-4 grid-cols-1 lg:grid-cols-3">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
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
    .map(([files, count]) => ({
      name: `${files}`,
      count,
    }));

  const languages = list.reduce(
    (acc, snippet) => {
      snippet.languages.forEach((lang) => {
        acc[lang.name] = (acc[lang.name] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );
  const topLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count], index) => ({ name, count, fill: `hsl(var(--chart-${(index % 5) + 1}))` }));

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
    .map(([name, count]) => ({
      name: name.length > 10 ? name.substring(0, 10) + '...' : name,
      count,
    }));

  const languageChartConfig = topLanguages.reduce((acc, lang, index) => {
    acc[lang.name] = {
      label: lang.name,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);

  const tagChartConfig = topTags.reduce((acc, tag, index) => {
    acc[tag.name] = {
      label: tag.name,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);

  const filesChartConfig: ChartConfig = filesPerSnippetData.reduce((acc, item, index) => {
    acc[item.name] = {
      label: `${item.name} ${Number(item.name) === 1 ? 'file' : 'files'}`,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="mt-8 grid gap-4 grid-cols-1 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>{t('pages.dashboard.topLanguages')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={languageChartConfig} className="w-full h-[250px]">
            <BarChart data={topLanguages}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" barSize={15}>
                {topLanguages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('pages.dashboard.topTags')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={tagChartConfig} className="w-full h-[250px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={topTags}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                label={({ name }) => name}
                labelLine
              >
                {topTags.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('pages.dashboard.filesPerSnippet')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={filesChartConfig} className="w-full h-[250px]">
            <BarChart layout="vertical" data={filesPerSnippetData}>
              <CartesianGrid vertical={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={60} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" barSize={20}>
                {filesPerSnippetData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
