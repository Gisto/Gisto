import { GistFileType } from '@/types/gist.ts';

export const Image = ({ file }: { file: GistFileType }) => (
  <div className="flex justify-center bg-background mb-4 items-center">
    <img src={file.raw_url} alt={file.filename} />
  </div>
);
