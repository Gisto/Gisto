import katex from 'katex';

import 'katex/contrib/mhchem';
import 'katex/dist/katex.min.css';

import { SnippetFileType } from '@/types/snippet.ts';

export const Latex = ({ file }: { file: SnippetFileType }) => {
  const html = katex.renderToString(file.content, {
    throwOnError: false,
    output: 'htmlAndMathml',
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
