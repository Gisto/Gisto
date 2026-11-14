import { KIND_META } from '@/components/snippet-kinds/kind-meta.ts';
import { t } from '@/lib/i18n';
import { SnippetKind } from '@/types/snippet.ts';

export const KindIcon = ({
  kind,
  className,
}: {
  kind: Exclude<SnippetKind, 'snippet'>;
  className?: string;
}) => {
  const Icon = KIND_META[kind].icon;
  return <Icon className={className} aria-label={t(`common.${kind}`)} />;
};
