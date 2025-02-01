import { GistFileType } from '@/types/gist.ts';

export const Image = ({ file }: { file: GistFileType }) => {
  let src = file.raw_url;

  if (file.content.startsWith('data:image')) {
    src = file.content;
  }

  return (
    <div className="flex justify-center bg-background mb-4 items-center">
      <img src={src} alt={file.filename} />
    </div>
  );
};
