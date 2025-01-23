import { useState } from 'react';

import { Editor } from '@/components/layout/pages/snippet/content/editor.tsx';
import { Header } from '@/components/layout/pages/snippet/content/header.tsx';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { GistFileType, GistType } from '@/types/gist.ts';

export const File = ({ file, snippet }: { file: GistFileType; snippet: GistType }) => {
  const settings = useStoreValue('settings');
  const [collapsed, setCollapsed] = useState(settings.filesCollapsedByDefault);
  const [preview, setPreview] = useState(false);

  return (
    <>
      <Header
        preview={preview}
        setPreview={setPreview}
        file={file}
        snippet={snippet}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <Editor preview={preview} collapsed={collapsed} file={file} snippet={snippet} />
    </>
  );
};
