import SwaggerUI from 'swagger-ui-react';

import 'swagger-ui-react/swagger-ui.css';
import { GistFileType } from '@/types/gist.ts';

export const OpenApi = ({ file }: { file: GistFileType }) => {
  return (
    <div className="w-full">
      <SwaggerUI url={file.raw_url} />
    </div>
  );
};
