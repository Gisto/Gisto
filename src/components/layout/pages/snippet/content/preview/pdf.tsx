import { SnippetFileType } from '@/types/snippet.ts';

export const Pdf = ({ file }: { file: SnippetFileType }) => (
  <iframe
    className="w-full h-65dvh border-none mb-4"
    src={`https://drive.google.com/viewerng/viewer?url=${file.raw_url}&embedded=true`}
  />
);

//
