import { RotateCcw, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { OrderedStep, ReferenceEntry } from '@/components/snippet-kinds/views/doc-view-parts.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { t } from '@/lib/i18n';
import { DocMode } from '@/lib/snippet-kinds/manifest.ts';
import { useKindSaver } from '@/lib/snippet-kinds/use-kind-saver.ts';
import { useKindState } from '@/lib/snippet-kinds/use-kind-state.ts';
import { DocEntry, SnippetSingleType } from '@/types/snippet.ts';
import {
  docEntryKeys,
  findDocFile,
  getDocDone,
  MANIFEST_FILENAME,
  parseDoc,
  serializeDoc,
  serializeManifest,
} from '@/utils';

export const DocView = ({
  snippet,
  ordered,
  onUpdated,
}: {
  snippet: SnippetSingleType;
  ordered: boolean;
  onUpdated?: (content: string) => void;
}) => {
  const mode: DocMode = ordered ? 'ordered' : 'reference';
  const parseEntries = useCallback((content: string) => parseDoc(content, mode), [mode]);
  const [entries] = useKindState(
    findDocFile(snippet.files)?.content ?? '',
    snippet.id,
    parseEntries
  );
  const [query, setQuery] = useState('');
  const [doneTitles, setDoneTitles] = useState<string[]>(() => getDocDone(snippet.files));
  const { save, saving } = useKindSaver(snippet, 'doc', onUpdated);

  const keys = useMemo(() => docEntryKeys(entries), [entries]);
  const keyByEntry = useMemo(
    () => new Map(entries.map((entry, index) => [entry.id, keys[index]])),
    [entries, keys]
  );
  const done = useMemo(() => new Set(doneTitles), [doneTitles]);

  /** Persist the completion list, which lives in the manifest beside the doc. */
  const setDone = async (nextTitles: string[]) => {
    const previous = doneTitles;

    setDoneTitles(nextTitles);
    const saved = await save(serializeDoc(entries), t('pages.snippet.docUpdateError'), {
      [MANIFEST_FILENAME]: {
        content: serializeManifest({ type: 'doc', ordered, done: nextTitles }),
      },
    });

    if (!saved) setDoneTitles(previous);
  };

  const toggle = (index: number) => {
    const key = keys[index];

    void setDone(done.has(key) ? doneTitles.filter((item) => item !== key) : [...doneTitles, key]);
  };

  const toggleAll = (value: boolean) => {
    void setDone(value ? keys : []);
  };

  if (entries.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        {saving ? <RotateCcw className="mb-2 size-4 animate-spin" /> : null}
        {t(ordered ? 'pages.snippet.docOrderedEmpty' : 'pages.snippet.docReferenceEmpty')}
      </div>
    );
  }

  const filtered = query.trim()
    ? entries.filter((entry) =>
        [entry.section, entry.title, entry.description, entry.code]
          .join('\n')
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      )
    : entries;

  const completed = keys.filter((key) => done.has(key)).length;

  const grouped = filtered.reduce<{ section: string; entries: DocEntry[] }[]>((groups, entry) => {
    const group = groups.find((item) => item.section === entry.section);
    if (group) {
      group.entries.push(entry);
    } else {
      groups.push({ section: entry.section, entries: [entry] });
    }
    return groups;
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 p-4 pb-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {t('pages.snippet.docProgress', { done: completed, total: entries.length })}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={completed === 0 || saving}
            onClick={() => toggleAll(false)}
          >
            <RotateCcw className="size-3.5" />
            {t('pages.snippet.docReset')}
          </Button>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-success transition-all"
            style={{ width: `${entries.length ? (completed / entries.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {ordered ? (
        filtered.map((entry) => (
          <OrderedStep
            key={entry.id}
            entry={entry}
            index={keys.indexOf(keyByEntry.get(entry.id) ?? '')}
            total={entries.length}
            done={done.has(keyByEntry.get(entry.id) ?? '')}
            onToggle={() => toggle(keys.indexOf(keyByEntry.get(entry.id) ?? ''))}
          />
        ))
      ) : (
        <>
          <div className="sticky top-0 z-10 bg-secondary/95 py-2 backdrop-blur">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('pages.snippet.docSearch')}
                className="pl-9"
                aria-label={t('pages.snippet.docSearch')}
              />
            </div>
          </div>

          {grouped.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              {t('pages.snippet.docNoResults')}
            </div>
          ) : (
            grouped.map((group) => (
              <section key={group.section || '__root'} className="flex flex-col gap-2">
                {group.section && (
                  <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-primary uppercase">
                    {group.section}
                    <span className="text-muted-foreground">({group.entries.length})</span>
                  </h3>
                )}
                <div className="grid gap-2 md:grid-cols-2">
                  {group.entries.map((entry) => (
                    <ReferenceEntry
                      key={entry.id}
                      entry={entry}
                      done={done.has(keyByEntry.get(entry.id) ?? '')}
                      onToggle={() => toggle(keys.indexOf(keyByEntry.get(entry.id) ?? ''))}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </>
      )}
    </div>
  );
};
