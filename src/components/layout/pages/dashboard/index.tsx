import { AllLanguages } from '@/components/all-languages.tsx';
import { AllTags } from '@/components/all-tags.tsx';
import { CardsCharts } from '@/components/layout/pages/dashboard/cards-charts.tsx';
import { SnippetsOverTimeChart } from '@/components/layout/pages/dashboard/snippets-over-time-chart.tsx';
import { PageContent } from '@/components/layout/pages/page-content.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { Loading } from '@/components/loading.tsx';
import { globalState, useStoreValue } from '@/lib/store/globalState.ts';

export const DashBoard = () => {
  const search = useStoreValue('search');
  const list = useStoreValue('snippets');

  if (!list || list.length === 0) return <Loading />;

  return (
    <div className="h-screen w-full border-r border-collapse">
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="line-clamp-1">Dashboard</div>
          </div>
        </div>
      </PageHeader>

      <PageContent>
        <CardsCharts />
        <SnippetsOverTimeChart />
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
