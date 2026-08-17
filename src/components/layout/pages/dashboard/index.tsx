import { FolderKanbanIcon } from 'lucide-react';

import { AllLanguages } from '@/components/all-languages.tsx';
import { AllTags } from '@/components/all-tags.tsx';
import { CardsCharts } from '@/components/layout/pages/dashboard/cards-charts.tsx';
import { FilesPerSnippet } from '@/components/layout/pages/dashboard/files-per-snippet.tsx';
import { Insights } from '@/components/layout/pages/dashboard/insights.tsx';
import { SnippetsOverTimeChart } from '@/components/layout/pages/dashboard/snippets-over-time-chart.tsx';
import { TopLanguages } from '@/components/layout/pages/dashboard/top-languages.tsx';
import { PageContent } from '@/components/layout/pages/page-content.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { Updater } from '@/components/updater.tsx';
import { t } from '@/lib/i18n';
import { globalState, useStoreValue } from '@/lib/store/globalState.ts';

export const DashBoard = () => {
  const search = useStoreValue('search');
  const list = useStoreValue('snippets');
  const isLoading = useStoreValue('isLoading');
  const totalSnippetCount = useStoreValue('totalSnippetCount');
  const user = useStoreValue('user');
  const userRecord = (user ?? {}) as Record<string, unknown>;
  const displayName =
    (typeof userRecord.name === 'string' && userRecord.name) ||
    (typeof userRecord.login === 'string' && userRecord.login) ||
    (typeof userRecord.username === 'string' && userRecord.username) ||
    '';

  const hour = new Date().getHours();
  const greetingKey =
    hour < 12
      ? 'pages.dashboard.goodMorning'
      : hour < 18
        ? 'pages.dashboard.goodAfternoon'
        : 'pages.dashboard.goodEvening';
  const greeting = `${t(greetingKey)}${displayName ? `, ${displayName}` : ''}`;

  const hasNoData = !list || (list.length === 0 && totalSnippetCount === 0);

  if (hasNoData && !isLoading) {
    return (
      <div className="h-screen w-full min-w-0 border-r border-collapse">
        <div className="flex gap-2 h-[52px] items-center p-2 border-b">
          <div className="line-clamp-1">{t('pages.dashboard.title')}</div>
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-52px)] w-full">
          <FolderKanbanIcon size={256} className="opacity-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full min-w-0 border-r border-collapse">
      <PageHeader>
        <div className="flex items-center w-full">
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="line-clamp-1 font-heading text-xl font-semibold text-foreground">
                {greeting}
              </div>
              <div className="text-xs text-muted-foreground">{t('pages.dashboard.subtitle')}</div>
            </div>
            <Updater />
          </div>
        </div>
      </PageHeader>

      <PageContent>
        <CardsCharts />
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SnippetsOverTimeChart />
          </div>
          <Insights />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TopLanguages />
          <FilesPerSnippet />
        </div>
        <AllLanguages
          className="mt-8"
          active={search}
          onClick={(language) =>
            search === 'lang:' + language.toLowerCase()
              ? globalState.setState({ search: '' })
              : globalState.setState({ search: `lang:${language.toLowerCase()}` })
          }
        />
        <AllTags
          className="mt-8"
          active={search}
          onClick={(tag) =>
            search === 'tag:' + tag.replace('#', '')
              ? globalState.setState({ search: '' })
              : globalState.setState({ search: `tag:${tag.replace('#', '')}` })
          }
        />
      </PageContent>
    </div>
  );
};
