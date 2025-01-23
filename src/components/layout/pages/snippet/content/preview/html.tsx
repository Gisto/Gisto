import { GistFileType } from '@/types/gist.ts';

export const Html = ({ file }: { file: GistFileType }) => (
  <iframe className="w-full h-full border-none" sandbox="" srcDoc={file.content} />
);
