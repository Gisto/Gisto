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
import { SnippetEnrichedType } from '@/types/snippet.ts';
import { upperCaseFirst } from '@/utils';

function generateChartData(list: SnippetEnrichedType[], period = '6months') {
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
      startDate.setFullYear(startDate.getFullYear() - 1);
  }

  const dateMap = new Map();

  for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
    dateMap.set(d.toISOString().split('T')[0], { public: 0, private: 0 });
  }

  list.forEach((snippet) => {
    const createdDate = snippet.createdAt.split('T')[0];
    if (dateMap.has(createdDate)) {
      const entry = dateMap.get(createdDate);
      if (snippet.isPublic) {
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
        <div className="flex flex-1 flex-col justify-center gap-1 sm:py-6">
          <CardTitle>{t('pages.dashboard.snippetsOverTime')}</CardTitle>
          <CardDescription>
            {t('pages.dashboard.snippetsOverTimeRange', { range: rangeToText(range) })}
          </CardDescription>
        </div>
        <div className="flex items-center">
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
        <ChartContainer config={chartConfig} className="w-full h-50">
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
      </CardContent>
    </Card>
  );
};
