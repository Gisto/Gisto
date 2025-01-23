import { parse } from 'marked';

import { useTheme } from '@/components/theme/theme-provider.tsx';
import { GistFileType } from '@/types/gist.ts';

export const Markdown = ({ file }: { file: GistFileType }) => {
  const { theme } = useTheme();

  const content = `
  <html>
    <head>
    <link href="/github-markdown.css" rel="stylesheet">
    <link href="/github-markdown-${theme}.css" rel="stylesheet">
    </head>
    <body class="markdown-body">
      ${parse(file.content)}
    </body>
  </html>
`;

  return (
    <div className="bg-background py-4 px-8 w-full overflow-scroll mb-4">
      <iframe className="w-full overflow-scroll h-[65vh]" srcDoc={content} />
    </div>
  );
};

//
