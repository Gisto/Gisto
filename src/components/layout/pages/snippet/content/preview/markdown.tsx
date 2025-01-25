import markdownIt from 'markdown-it';

import { useTheme } from '@/components/theme/theme-provider.tsx';
import { GistFileType } from '@/types/gist.ts';

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet('target', '_blank');

  return defaultRender(tokens, idx, options, env, self);
};

const setThemeCss = (theme: string) => {
  import('@/styles/github-markdown.css?inline').then((css) => {
    const style = document.createElement('style');
    style.textContent = css.default;
    document.head.appendChild(style);
  });
  import(`@/styles/github-markdown-${theme}.css?inline`).then((css) => {
    const style = document.createElement('style');
    style.textContent = css.default;
    document.head.appendChild(style);
  });
};

export const Markdown = ({ file }: { file: GistFileType }) => {
  const { theme } = useTheme();
  setThemeCss(theme);
  const result = md.render(file.content);

  return (
    <div className="bg-background py-4 px-8 overflow-scroll mb-4">
      <div className="max-w-[53vw] h-auto">
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: result }} />
      </div>
    </div>
  );
};

//
