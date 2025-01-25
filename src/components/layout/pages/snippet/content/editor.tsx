import MonacoEditor from '@monaco-editor/react';
import { useRef, useState } from 'react';

import { Html } from '@/components/layout/pages/snippet/content/preview/html.tsx';
import { Image } from '@/components/layout/pages/snippet/content/preview/image.tsx';
import { Markdown } from '@/components/layout/pages/snippet/content/preview/markdown.tsx';
import { Pdf } from '@/components/layout/pages/snippet/content/preview/pdf.tsx';
import { useTheme } from '@/components/theme/theme-provider.tsx';
import { EDITOR_OPTIONS } from '@/constants';
import { languageMap } from '@/constants/language-map.ts';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { isHTML, isImage, isMarkdown, isPDF } from '@/lib/utils.ts';
import { GistFileType, GistType } from '@/types/gist.ts';

export const Editor = ({
  file,
  snippet,
  preview,
}: {
  file: GistFileType;
  snippet: GistType;
  preview: boolean;
}) => {
  const settings = useStoreValue('settings');
  const [height, setHeight] = useState('65vh');
  const { theme } = useTheme();
  const editorRef = useRef(null);

  if (file.truncated) {
    return (
      <div className="bg-background py-2 px-4 overflow-auto mb-4 font-mono">
        <div className="p-4">
          File too large, please{' '}
          <a
            className="underline hover:underline-offset-2"
            target="_blank"
            href={`${snippet.html_url}#file-${file.filename
              .replace(/\\|-|\./g, '-')
              .replace(/--/g, '-')
              .toLowerCase()}`}
          >
            open on web
          </a>
        </div>
      </div>
    );
  }

  if (preview) {
    if (isMarkdown(file)) {
      return <Markdown file={file} />;
    }

    if (isPDF(file)) {
      return <Pdf file={file} />;
    }

    if (isHTML(file)) {
      return <Html file={file} />;
    }

    if (isImage(file)) {
      return <Image file={file} />;
    }
  }

  // @ts-expect-error 3rd party types
  function handleEditorDidMount(editor) {
    editorRef.current = editor;
    const originalLineCount = editor.getContentHeight() || 0;

    setHeight(originalLineCount > 500 ? '65vh' : originalLineCount);
  }

  return (
    <MonacoEditor
      options={{
        ...EDITOR_OPTIONS,
        ...settings.editor,
      }}
      onMount={handleEditorDidMount}
      height={height}
      theme={theme === 'dark' ? 'vs-dark' : 'light'}
      defaultLanguage={languageMap[file.language || file.filename.split('.')[1]] ?? 'text'}
      defaultValue={file.content}
    />
  );
};
