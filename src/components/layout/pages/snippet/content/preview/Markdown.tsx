import { useEffect, useState } from 'react';

import { GithubAPI } from '@/lib/GithubApi.ts';
import { GistFileType } from '@/types/gist.ts';

import '@/github-markdown.css';

export const Markdown = ({ file }: { file: GistFileType }) => {
  const [content, setContent] = useState('');
  useEffect(() => {
    (async () => {
      const data = await GithubAPI.getMarkdown(file.content);

      const result = await data;
      setContent(result);
    })();
  }, []);

  if (!content) {
    return null;
  }
  return (
    <div className="bg-background p-4 markdown-body w-full whitespace-pre-line">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

//
