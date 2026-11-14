import { Check, ChevronDown, Copy } from 'lucide-react';
import { useState } from 'react';

import { KindMarkdown } from '@/components/snippet-kinds/kind-markdown.tsx';
import { Button } from '@/components/ui/button.tsx';
import { t } from '@/lib/i18n';
import { DocEntry } from '@/types/snippet.ts';
import { cn, copyToClipboard } from '@/utils';

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="group relative mt-2 overflow-hidden rounded-md border border-border bg-background">
      {language && (
        <div className="border-b border-border px-3 py-1 text-[10px] tracking-wide text-muted-foreground uppercase">
          {language}
        </div>
      )}
      <pre className="overflow-x-auto p-3 pr-10 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 size-7 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => {
          void copyToClipboard(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        aria-label={copied ? t('common.copied') : t('common.copy')}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </Button>
    </div>
  );
};

const EntryDetails = ({ entry }: { entry: DocEntry }) => (
  <>
    {entry.description.trim() && (
      <KindMarkdown text={entry.description} className="text-muted-foreground" />
    )}
    {entry.code && <CodeBlock code={entry.code} language={entry.language} />}
  </>
);

export const OrderedStep = ({
  entry,
  index,
  total,
  done,
  onToggle,
}: {
  entry: DocEntry;
  index: number;
  total: number;
  done: boolean;
  onToggle: () => void;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={cn(
        'rounded-lg border bg-card transition-colors',
        done ? 'border-success/40' : 'border-border'
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={t('pages.snippet.docToggleStep')}
          aria-pressed={done}
          className={cn(
            'flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors',
            done
              ? 'border-success bg-success text-background'
              : 'border-muted-foreground/40 text-transparent hover:border-primary hover:text-primary/40'
          )}
        >
          <Check className="size-3.5" />
        </button>

        <span className="w-6 shrink-0 text-center text-xs text-muted-foreground">{index + 1}</span>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
          aria-expanded={open}
        >
          {entry.section && (
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
              {entry.section}
            </span>
          )}
          <span
            className={cn(
              'min-w-0 truncate text-sm font-medium',
              done && 'text-muted-foreground line-through'
            )}
          >
            <KindMarkdown text={entry.title || t('pages.snippet.docUntitledStep')} inline />
          </span>
          <ChevronDown
            className={cn(
              'size-4 shrink-0 text-muted-foreground transition-transform',
              !open && '-rotate-90'
            )}
          />
        </button>

        <span className="shrink-0 text-xs text-muted-foreground">
          {index + 1}/{total}
        </span>
      </div>

      {open && (
        <div className="flex flex-col gap-2 px-3 pb-3 pl-12">
          <EntryDetails entry={entry} />
        </div>
      )}
    </div>
  );
};

export const ReferenceEntry = ({
  entry,
  done,
  onToggle,
}: {
  entry: DocEntry;
  done: boolean;
  onToggle: () => void;
}) => (
  <div
    className={cn(
      'flex flex-col gap-1 rounded-lg border bg-card p-3 transition-colors',
      done ? 'border-success/40' : 'border-border'
    )}
  >
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        aria-label={t('pages.snippet.docToggleStep')}
        aria-pressed={done}
        className={cn(
          'flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors',
          done
            ? 'border-success bg-success text-background'
            : 'border-muted-foreground/40 text-transparent hover:border-primary hover:text-primary/40'
        )}
      >
        <Check className="size-3" />
      </button>
      {entry.title.trim() && (
        <div className={cn('text-sm font-medium', done && 'text-muted-foreground line-through')}>
          <KindMarkdown text={entry.title} inline />
        </div>
      )}
    </div>
    <div className={cn(done && 'opacity-60')}>
      <EntryDetails entry={entry} />
    </div>
  </div>
);
