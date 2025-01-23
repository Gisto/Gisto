import { GistFileType } from '@/types/gist.ts';

export const Pdf = ({ file }: { file: GistFileType }) => (
  <iframe
    className="w-full h-full border-none mb-4"
    src={`https://drive.google.com/viewerng/viewer?url=${file.raw_url}&embedded=true`}
  />
);

//
