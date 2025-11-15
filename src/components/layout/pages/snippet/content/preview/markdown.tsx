import { alert } from '@mdit/plugin-alert';
import { tasklist } from '@mdit/plugin-tasklist';
import hljs from 'highlight.js';
import markdownIt from 'markdown-it';
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import { CopyToClipboardButton } from '@/components/copy-to-clipboard-button.tsx';
import { useTheme } from '@/components/theme/theme-provider.tsx';
import { upperCaseFirst } from '@/lib/utils';
import { GistFileType } from '@/types/gist.ts';

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang?: string): string => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><div class="relative text-xs border-b bottom-1 pb-3 mb-4">${upperCaseFirst(lang)}</div><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch (err) {
        console.error('Error highlighting code:', err);
        void err;
      }
    }
    try {
      return `<pre><code class="hljs">${hljs.highlightAuto(str).value}</code></pre>`;
    } catch (err) {
      void err;
      return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
    }
  },
});

md.use(tasklist);
md.use(alert);

const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet('target', '_blank');

  return defaultRender(tokens, idx, options, env, self);
};

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

export const Markdown = ({ file }: { file: GistFileType }) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  setThemeCss(theme);
  const result = md.render(file.content);

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

    return () => {
      roots.forEach(({ root }) => {
        root.unmount();
      });
    };
  }, [result]);

  return (
    <div className="bg-background py-4 px-8 overflow-scroll mb-4">
      <div className="max-w-[53vw] h-auto">
        <div
          ref={containerRef}
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: result }}
        />
      </div>
    </div>
  );
};
