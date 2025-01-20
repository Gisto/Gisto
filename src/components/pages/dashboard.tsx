import { useState } from 'react';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { PageHeader } from '@/components/layout/page-header.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Badge } from '@/components/ui/badge.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Loading } from '@/components/Loading.tsx';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { GistEnrichedType } from '@/types/gist.ts';

function generateChartData(list: GistEnrichedType[], period = '6months') {
  const now = new Date();
  const startDate = new Date(now);

  switch (period) {
    case '7days':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30days':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '6months':
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case '1year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      throw new Error('Invalid period');
  }

  const dateMap = new Map();

  for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
    dateMap.set(d.toISOString().split('T')[0], { public: 0, private: 0 });
  }

  list.forEach((gist) => {
    const createdDate = gist.createdAt.split('T')[0];
    if (dateMap.has(createdDate)) {
      const entry = dateMap.get(createdDate);
      if (gist.isPublic) {
        entry.public++;
      } else {
        entry.private++;
      }
    }
  });

  return Array.from(dateMap, ([date, counts]) => ({
    date,
    public: counts.public,
    private: counts.private,
  }));
}

const chartConfig = {
  public: {
    label: 'Public',
    color: 'hsl(var(--chart-1))',
  },
  private: {
    label: 'Private',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const rangeToText = (range: string) => {
  switch (range) {
    case '7days':
      return '1 week ago';
    case '30days':
      return '1 month ago';
    case '6months':
      return '6 months ago';
    case '1year':
      return '1 year ago';
    default:
      return '';
  }
};

export const DashBoard = () => {
  const [range, setRange] = useState('6months');
  const list = useStoreValue('snippets');

  if (!list || list.length === 0) return <Loading />;

  const allTags = list.map((snippet) => snippet.tags).flat();
  const allLanguages = list.map((snippet) => snippet.languages).flat();

  const cardCharts = [
    {
      title: 'Public / Private',
      value: `${list.filter((snippet) => snippet.isPublic).length} / ${list.filter((snippet) => !snippet.isPublic).length}`,
    },
    { title: 'Starred', value: list.filter((snippet) => snippet.stars).length },
    {
      title: 'Untagged',
      value: list.filter((snippet) => snippet.tags.length === 0).length,
    },
    {
      title: 'Untitled',
      value: list.filter((snippet) => snippet.description.toLowerCase() === 'untitled').length,
    },
  ];

  return (
    <div className="h-screen w-full border-r border-collapse overflow-auto">
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="line-clamp-1">Dashboard</div>
          </div>
        </div>
      </PageHeader>

      <div className="p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {cardCharts.map((chart) => (
            <Card key={chart.title}>
              <CardHeader>
                <CardDescription className="text-foreground text-lg whitespace-nowrap">
                  {chart.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-primary text-2xl text-right font-bold font-numbers">
                {chart.value}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Snippets over time</CardTitle>
              <CardDescription>
                Showing snippets created during a period of today and {rangeToText(range)}
              </CardDescription>
            </div>
            <div className="flex items-center p-8">
              <Select value={range} onValueChange={(value) => setRange(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Range</SelectLabel>
                    <SelectItem value="7days">1 week ago</SelectItem>
                    <SelectItem value="30days">1 month ago</SelectItem>
                    <SelectItem value="6months">6 months ago</SelectItem>
                    <SelectItem value="1year">1 year ago</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <BarChart accessibilityLayer data={generateChartData(list, range)}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });
                      }}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="private"
                  stackId="a"
                  fill="var(--color-private)"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="public"
                  stackId="a"
                  fill="var(--color-public)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>

            {/*<ChartContainer config={chartConfig}>*/}
            {/*  <AreaChart*/}
            {/*    accessibilityLayer*/}
            {/*    data={generateChartData(list)}*/}
            {/*    margin={{*/}
            {/*      left: 12,*/}
            {/*      right: 12,*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <CartesianGrid vertical={false} />*/}
            {/*    <XAxis*/}
            {/*      dataKey="date"*/}
            {/*      tickLine={false}*/}
            {/*      axisLine={false}*/}
            {/*      tickMargin={8}*/}
            {/*      minTickGap={32}*/}
            {/*      tickFormatter={(value) => {*/}
            {/*        const date = new Date(value);*/}
            {/*        return date.toLocaleDateString('en-US', {*/}
            {/*          month: 'short',*/}
            {/*          day: 'numeric',*/}
            {/*        });*/}
            {/*      }}*/}
            {/*    />*/}
            {/*    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />*/}
            {/*    <defs>*/}
            {/*      <linearGradient id="fillPrivate" x1="0" y1="0" x2="0" y2="1">*/}
            {/*        <stop offset="5%" stopColor="var(--color-private)" stopOpacity={0.8} />*/}
            {/*        <stop offset="95%" stopColor="var(--color-private)" stopOpacity={0.1} />*/}
            {/*      </linearGradient>*/}
            {/*      <linearGradient id="fillPublic" x1="0" y1="0" x2="0" y2="1">*/}
            {/*        <stop offset="5%" stopColor="var(--color-public)" stopOpacity={0.8} />*/}
            {/*        <stop offset="95%" stopColor="var(--color-public)" stopOpacity={0.1} />*/}
            {/*      </linearGradient>*/}
            {/*    </defs>*/}
            {/*    <Area*/}
            {/*      dataKey="public"*/}
            {/*      type="natural"*/}
            {/*      fill="url(#fillPublic)"*/}
            {/*      fillOpacity={0.4}*/}
            {/*      stroke="var(--color-public)"*/}
            {/*      stackId="a"*/}
            {/*    />*/}
            {/*    <Area*/}
            {/*      dataKey="private"*/}
            {/*      type="natural"*/}
            {/*      fill="url(#fillPrivate)"*/}
            {/*      fillOpacity={0.4}*/}
            {/*      stroke="var(--color-private)"*/}
            {/*      stackId="a"*/}
            {/*    />*/}
            {/*  </AreaChart>*/}
            {/*</ChartContainer>*/}
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div>Languages</div>{' '}
              <div>
                <Input placeholder="Filter languages" />
              </div>
            </CardTitle>
            <CardDescription>All, unique languages</CardDescription>
          </CardHeader>
          <CardContent>
            {Array.from(new Set(allLanguages.map((lang) => lang.name)))
              .map((name) => {
                const language = allLanguages.find((lang) => lang.name === name);
                const count = allLanguages.filter((lang) => lang.name === name).length;
                return { language, count };
              })
              .sort((a, b) => b.count - a.count)
              .map(({ language, count }) => (
                <Badge
                  key={language?.name}
                  variant="primary-outline"
                  className="m-1 cursor-pointer hover:opacity-70"
                >
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ background: language?.color }}
                  />{' '}
                  {language?.name} <small className="ml-1">({count})</small>
                </Badge>
              ))}
          </CardContent>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>Tags</div>{' '}
                <div>
                  <Input placeholder="Filter tags" />
                </div>
              </CardTitle>
              <CardDescription>All, unique tags</CardDescription>
            </CardHeader>
            <CardContent>
              {[...new Set(allTags)]
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
                  >
                    {tag} <small className="ml-1">({count})</small>
                    {/*<div className="ml-[6px] -mr-[9px]  w-5 h-4 bg-primary text-background text-[9px] text-center">*/}
                    {/*  {count}*/}
                    {/*</div>*/}
                  </Badge>
                ))}
            </CardContent>
          </Card>
        </Card>
      </div>
    </div>
  );
};
