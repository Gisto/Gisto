import MonacoEditor from '@monaco-editor/react';
import { Skull } from 'lucide-react';
import { useRef, useState } from 'react';

import type { Monaco } from '@monaco-editor/react';

import bslLanguage from '@/components/layout/pages/snippet/content/monarchs/bsl.monarch';
import groovyLanguage from '@/components/layout/pages/snippet/content/monarchs/groovy.monarch';
import { Csv } from '@/components/layout/pages/snippet/content/preview/csv.tsx';
import { GeoJson } from '@/components/layout/pages/snippet/content/preview/geo-json.tsx';
import { Html } from '@/components/layout/pages/snippet/content/preview/html.tsx';
import { Image } from '@/components/layout/pages/snippet/content/preview/image.tsx';
import { JsonViewer } from '@/components/layout/pages/snippet/content/preview/json-viewer.tsx';
import { Latex } from '@/components/layout/pages/snippet/content/preview/latex.tsx';
import { Markdown } from '@/components/layout/pages/snippet/content/preview/markdown.tsx';
import { OpenApi } from '@/components/layout/pages/snippet/content/preview/open-api.tsx';
import { Pdf } from '@/components/layout/pages/snippet/content/preview/pdf.tsx';
import { EDITOR_OPTIONS } from '@/constants';
import { languageMap } from '@/constants/language-map.ts';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';
import {
  getEditorTheme,
  isCSV,
  isGeoJson,
  isHTML,
  isImage,
  isJson,
  isLaTex,
  isMarkdown,
  isOpenApi,
  isPDF,
  isTSV,
  getLanguageName,
} from '@/lib/utils';
import { SnippetFileType, SnippetSingleType } from '@/types/snippet.ts';

export const Editor = ({
  file,
  snippet,
  preview,
}: {
  file: SnippetFileType;
  snippet: SnippetSingleType;
  preview: boolean;
}) => {
  const settings = useStoreValue('settings');
  const [height, setHeight] = useState('65vh');
  const editorRef = useRef(null);

  if (file.truncated) {
    return (
      <div className="bg-background py-2 px-4 overflow-auto mb-4 font-mono">
        <div className="p-4">
          {t('pages.snippet.fileTooLarge')}{' '}
          <a
            className="underline hover:underline-offset-2"
            target="_blank"
            href={`${snippet.html_url}#file-${file.filename
              .replace(/\\|-|\./g, '-')
              .replace(/--/g, '-')
              .toLowerCase()}`}
          >
            {t('pages.snippet.openOnWeb')}
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

    if (isGeoJson(file)) {
      return <GeoJson file={file} />;
    }

    if (isJson(file)) {
      try {
        JSON.parse(file.content);
      } catch {
        return (
          <div className="bg-background overflow-auto font-body flex items-center">
            <Skull className="stroke-danger" />
            <div className="p-4 text-danger">{t('pages.snippet.invalidJson')}</div>
          </div>
        );
      }

      return <JsonViewer data={JSON.parse(file.content)} />;
    }

    if (isImage(file)) {
      return <Image file={file} />;
    }

    if (isCSV(file) || isTSV(file)) {
      return <Csv file={file} />;
    }

    if (isOpenApi(file)) {
      return <OpenApi file={file} />;
    }

    if (isLaTex(file)) {
      return <Latex file={file} />;
    }
  }

  // @ts-expect-error 3rd party types
  function handleEditorDidMount(editor) {
    editorRef.current = editor;

    const originalLineCount = editor.getContentHeight() || 0;

    // TODO: see if we want, needs readOnly: false
    // editor.getAction('editor.action.formatDocument').run();

    setHeight(originalLineCount > 500 ? '65vh' : originalLineCount);
  }

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.languages.register({ id: 'groovy' });
    monaco.languages.setMonarchTokensProvider('groovy', groovyLanguage);
    monaco.languages.register({ id: 'bsl', extensions: ['.bsl', '.os'] });
    monaco.languages.setMonarchTokensProvider('bsl', bslLanguage);
  };

  return (
    <MonacoEditor
      options={{
        ...EDITOR_OPTIONS,
        ...settings.editor,
      }}
      onMount={handleEditorDidMount}
      beforeMount={handleEditorWillMount}
      height={height}
      theme={getEditorTheme()}
      defaultLanguage={languageMap[getLanguageName(file) || file.filename.split('.')[1]] ?? 'text'}
      defaultValue={file.content}
    />
  );
};
