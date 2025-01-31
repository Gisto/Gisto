import katex from 'katex';

import 'katex/contrib/mhchem';
import 'katex/dist/katex.min.css';

import { GistFileType } from '@/types/gist.ts';

export const Latex = ({ file }: { file: GistFileType }) => {
  const html = katex.renderToString(file.content, {
    throwOnError: false,
    output: 'htmlAndMathml',
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
