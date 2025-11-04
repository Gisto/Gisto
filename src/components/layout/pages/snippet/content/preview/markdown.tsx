import markdownIt from 'markdown-it';
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import { CopyToClipboardButton } from '@/components/copy-to-clipboard-button.tsx';
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

// 自定义代码块渲染,添加唯一标识符
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

  // 渲染原始代码块
  const rendered = defaultFenceRender(tokens, idx, options, env, self);

  // 包装在一个带有 ID 和相对定位的容器中
  return `<div class="code-block-wrapper" style="position: relative;" data-code-block-id="${id}" data-code="${encodeURIComponent(code)}">${rendered}</div>`;
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
  const containerRef = useRef<HTMLDivElement>(null);

  setThemeCss(theme);
  const result = md.render(file.content);

  useEffect(() => {
    if (!containerRef.current) return;

    // 查找所有代码块包装器
    const codeBlocks = containerRef.current.querySelectorAll('.code-block-wrapper');

    const roots: Array<{ root: ReturnType<typeof createRoot>; element: HTMLElement }> = [];

    codeBlocks.forEach((wrapper) => {
      const codeData = wrapper.getAttribute('data-code');
      if (!codeData) return;

      const code = decodeURIComponent(codeData);

      // 创建复制按钮容器
      const buttonContainer = document.createElement('div');
      buttonContainer.style.position = 'absolute';
      buttonContainer.style.top = '8px';
      buttonContainer.style.right = '8px';
      buttonContainer.style.zIndex = '10';

      wrapper.appendChild(buttonContainer);

      // 使用 React 18 的 createRoot API 渲染复制按钮
      const root = createRoot(buttonContainer);
      root.render(<CopyToClipboardButton text={code} />);

      roots.push({ root, element: buttonContainer });
    });

    // 清理函数
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

//
