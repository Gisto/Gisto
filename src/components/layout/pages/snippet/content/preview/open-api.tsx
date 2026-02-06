import SwaggerUI from 'swagger-ui-react';

import 'swagger-ui-react/swagger-ui.css';
import { SnippetFileType } from '@/types/snippet.ts';

export const OpenApi = ({ file }: { file: SnippetFileType }) => {
  return (
    <div className="w-full">
      <SwaggerUI url={file.raw_url} />
    </div>
  );
};
