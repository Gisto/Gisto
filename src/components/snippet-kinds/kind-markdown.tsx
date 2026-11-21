import { Markdown } from '@/components/markdown.tsx';
import { cn } from '@/utils';

const BLOCK_PROSE =
  'text-sm break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5 [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-background [&_code]:px-1 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-background [&_pre]:p-2 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm';

const INLINE_PROSE =
  '[&_p]:inline [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-background [&_code]:px-1 [&_strong]:font-semibold [&_em]:italic';

/**
 * Renders a kind field (title, description, card face, to-do text) as markdown,
 * on top of the shared renderer used by the snippet file preview.
 *
 * `inline` keeps the output on one line, for titles that sit next to badges or
 * are truncated by their container.
 */
export const KindMarkdown = ({
  text,
  className,
  inline = false,
}: {
  text: string;
  className?: string;
  inline?: boolean;
}) => (
  <Markdown
    frameless
    prose={false}
    content={text}
    className={cn(inline ? INLINE_PROSE : BLOCK_PROSE, className)}
  />
);
