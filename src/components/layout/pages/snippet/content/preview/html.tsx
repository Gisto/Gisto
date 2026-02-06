import { SnippetFileType } from '@/types/snippet.ts';

export const Html = ({ file }: { file: SnippetFileType }) => (
  <div className="max-h-65dvh h-65dvh">
    <iframe className="w-full h-full border-none" sandbox="" srcDoc={file.content} />
  </div>
);
