import { alert } from '@mdit/plugin-alert';
import { tasklist } from '@mdit/plugin-tasklist';
import markdownItMermaid from '@wekanteam/markdown-it-mermaid';
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import { CopyToClipboardButton } from '@/components/copy-to-clipboard-button.tsx';
import { useTheme } from '@/components/theme/theme-provider.tsx';
import { createMarkdown } from '@/lib/markdown.ts';
import { SnippetFileType } from '@/types/snippet.ts';
import { cn } from '@/utils';

const md = createMarkdown();

md.use(tasklist);
md.use(alert);
md.use(markdownItMermaid);

let codeBlockCounter = 0;
const defaultFenceRender =
  md.renderer.rules.fence ||
  function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.fence = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const code = token.content;
  const id = `code-block-${codeBlockCounter++}`;

  const rendered = defaultFenceRender(tokens, idx, options, env, self);

  return `<div class="code-block-wrapper" style="position: relative;" data-code-block-id="${id}" data-code="${encodeURIComponent(code)}">${rendered}</div>`;
};

const setThemeCss = (theme: string) => {
  if (theme === 'dark') {
    import(`highlight.js/styles/github-dark.css?inline`).then((css) => {
      const style = document.createElement('style');
      style.textContent = css.default;
      document.head.appendChild(style);
    });
    import(`@/styles/github-markdown-dark.css?inline`).then((css) => {
      const style = document.createElement('style');
      style.textContent = css.default;
      document.head.appendChild(style);
    });
  } else {
    import(`highlight.js/styles/github.css?inline`).then((css) => {
      const style = document.createElement('style');
      style.textContent = css.default;
      document.head.appendChild(style);
    });
    import('@/styles/github-markdown.css?inline').then((css) => {
      const style = document.createElement('style');
      style.textContent = css.default;
      document.head.appendChild(style);
    });
  }
};

export const Markdown = ({
  file,
  content,
  className,
  frameless = false,
  prose = true,
}: {
  file?: SnippetFileType;
  content?: string;
  /** Extra classes for the rendered markdown body. */
  className?: string;
  /** Skip the padded file-preview wrapper, e.g. when embedded in a kind view. */
  frameless?: boolean;
  /** Apply the github-markdown typography, off when caller styles the output. */
  prose?: boolean;
}) => {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  setThemeCss(resolvedTheme);
  const source = content ?? file?.content ?? '';
  const result = md.render(source);

  useEffect(() => {
    if (!containerRef.current) return;

    const codeBlocks = containerRef.current.querySelectorAll('.code-block-wrapper');

    const roots: Array<{ root: ReturnType<typeof createRoot>; element: HTMLElement }> = [];

    codeBlocks.forEach((wrapper) => {
      const codeData = wrapper.getAttribute('data-code');
      if (!codeData) return;

      const code = decodeURIComponent(codeData);

      const buttonContainer = document.createElement('div');
      buttonContainer.style.position = 'absolute';
      buttonContainer.style.top = '8px';
      buttonContainer.style.right = '8px';
      buttonContainer.style.zIndex = '10';

      wrapper.appendChild(buttonContainer);

      const root = createRoot(buttonContainer);
      root.render(<CopyToClipboardButton text={code} />);

      roots.push({ root, element: buttonContainer });
    });

    import('mermaid').then((mermaid) => {
      mermaid.default.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
      });
      mermaid.default.run({ querySelector: '.mermaid' });
    });

    return () => {
      roots.forEach(({ root }) => {
        root.unmount();
      });
    };
  }, [result, resolvedTheme]);

  const body = (
    <div
      ref={containerRef}
      className={cn(prose && 'markdown-body', className)}
      dangerouslySetInnerHTML={{ __html: result }}
    />
  );

  if (frameless) return body;

  return <div className="bg-background p-4 overflow-auto h-full">{body}</div>;
};
