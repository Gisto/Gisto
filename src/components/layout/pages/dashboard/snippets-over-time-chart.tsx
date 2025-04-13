import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { upperCaseFirst } from '@/lib/utils';
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
    label: upperCaseFirst(t('common.public')),
    color: 'hsl(var(--chart-1))',
  },
  private: {
    label: upperCaseFirst(t('common.private')),
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const rangeToText = (range: string) => {
  switch (range) {
    case '7days':
      return t('pages.dashboard.oneWeekAgo');
    case '30days':
      return t('pages.dashboard.oneMonthAgo');
    case '6months':
      return t('pages.dashboard.sixMonthsAgo');
    case '1year':
      return t('pages.dashboard.oneYearAgo');
    default:
      return '';
  }
};

export const SnippetsOverTimeChart = () => {
  const [range, setRange] = useState('30days');
  const list = useStoreValue('snippets');

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{t('pages.dashboard.snippetsOverTime')}</CardTitle>
          <CardDescription>
            {t('pages.dashboard.snippetsOverTimeRange', { range: rangeToText(range) })}
          </CardDescription>
        </div>
        <div className="flex items-center p-8">
          <Select value={range} onValueChange={(value) => setRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('common.range')}</SelectLabel>
                <SelectItem value="7days">{t('pages.dashboard.oneWeekAgo')}</SelectItem>
                <SelectItem value="30days">{t('pages.dashboard.oneMonthAgo')}</SelectItem>
                <SelectItem value="6months">{t('pages.dashboard.sixMonthsAgo')}</SelectItem>
                <SelectItem value="1year">{t('pages.dashboard.oneYearAgo')}</SelectItem>
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
            <Bar barSize={10} dataKey="private" stackId="a" fill="var(--color-private)" />
            <Bar barSize={10} dataKey="public" stackId="a" fill="var(--color-public)" />
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
  );
};
