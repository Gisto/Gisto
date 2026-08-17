import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState';

export const TopLanguages = () => {
  const list = useStoreValue('snippets');
  const totalSnippetCount = useStoreValue('totalSnippetCount');

  const isLoading = !list || (list.length === 0 && totalSnippetCount === 0);

  if (isLoading) {
    return (
      <Card className="flex h-full flex-col">
        <CardHeader>
          <div className="h-5 w-36 bg-foreground/10 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 bg-foreground/10 rounded animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!list || list.length === 0) return null;

  const languages = list.reduce(
    (acc, snippet) => {
      snippet.languages.forEach((lang) => {
        acc[lang.name] = (acc[lang.name] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const rows = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
  const max = rows[0]?.[1] ?? 1;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base text-foreground">
          {t('pages.dashboard.topLanguages')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center gap-4">
        {rows.length === 0 ? (
          <div className="text-sm text-muted-foreground">{t('list.noLanguages')}</div>
        ) : (
          rows.map(([name, count], index) => (
            <div key={name}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: `var(--chart-${(index % 12) + 1})` }}
                  />
                  <span className="truncate font-medium text-foreground">{name}</span>
                </span>
                <span className="font-numbers text-sm font-semibold text-muted-foreground">
                  {count}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(4, (count / max) * 100)}%`,
                    background: `var(--chart-${(index % 12) + 1})`,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
