import Editor from '@monaco-editor/react';
import { Expand, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { Csv } from '@/components/layout/pages/snippet/content/preview/csv.tsx';
import { Html } from '@/components/layout/pages/snippet/content/preview/html.tsx';
import { JsonViewer } from '@/components/layout/pages/snippet/content/preview/json-viewer.tsx';
import { Markdown } from '@/components/layout/pages/snippet/content/preview/markdown.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog.tsx';
import { EDITOR_OPTIONS } from '@/constants';
import { languageMap } from '@/constants/language-map.ts';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { SnippetFileType } from '@/types/snippet.ts';
import { getEditorTheme, isCSV, isHTML, isJson, isMarkdown, isTSV } from '@/utils';

type ExpandedEditorProps = {
  content: string;
  onChange: (value: string) => void;
  filename: string;
  language: string;
  index: number;
  onOpenChange?: (open: boolean) => void;
};

export const ExpandedEditor = ({
  content,
  onChange,
  filename,
  language,
  index,
  onOpenChange,
}: ExpandedEditorProps) => {
  const settings = useStoreValue('settings');
  const [open, setOpen] = useState(false);
  const [showPreviewPanel, setShowPreviewPanel] = useState(true);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    onOpenChange?.(isOpen);
  };

  const fileObj: SnippetFileType = {
    filename,
    content,
    language,
    encoding: '',
    raw_url: '',
    size: 0,
    truncated: false,
    type: '',
  };

  const showPreview = isMarkdown(fileObj);
  const showJsonPreview = isJson(fileObj) || isHTML(fileObj);
  const showCsvPreview = isCSV(fileObj) || isTSV(fileObj);

  const renderPreview = () => {
    if (isMarkdown(fileObj)) {
      return <Markdown file={fileObj} />;
    }
    if (isJson(fileObj)) {
      try {
        return <JsonViewer data={JSON.parse(content)} />;
      } catch {
        return <div className="p-4 text-danger">{t('pages.snippet.invalidJson')}</div>;
      }
    }
    if (isHTML(fileObj)) {
      return <Html file={fileObj} />;
    }
    if (isCSV(fileObj) || isTSV(fileObj)) {
      return <Csv file={fileObj} />;
    }
    return null;
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => handleOpenChange(true)}>
        <Expand />
        {t('common.expand')}
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          size="xl"
          className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh] flex flex-col"
        >
          <div className="flex flex-row items-center justify-between gap-4 mr-8">
            <DialogTitle className="mr-24 flex-1">{filename || t('pages.new.newFile')}</DialogTitle>
            {(showPreview || showJsonPreview || showCsvPreview) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreviewPanel(!showPreviewPanel)}
              >
                {showPreviewPanel ? <EyeOff /> : <Eye />}
                {showPreviewPanel ? t('common.hidePreview') : t('common.showPreview')}
              </Button>
            )}
          </div>
          <div className="flex flex-1 gap-4 mt-4 min-h-0 w-full overflow-hidden">
            <div
              className={
                (showPreview || showJsonPreview || showCsvPreview) && showPreviewPanel
                  ? 'w-1/2 min-h-0'
                  : 'w-full min-h-0'
              }
            >
              {open && (
                <Editor
                  key={`modal-${index}-${language}`}
                  value={content}
                  onChange={(value) => onChange(value || '')}
                  className="border-primary border rounded"
                  options={{
                    ...EDITOR_OPTIONS,
                    ...settings.editor,
                    readOnly: false,
                    codeLens: false,
                  }}
                  height="100%"
                  theme={getEditorTheme()}
                  language={languageMap[language] ?? 'text'}
                  path={`modal-editor-${index}`}
                />
              )}
            </div>
            {(showPreview || showJsonPreview || showCsvPreview) && showPreviewPanel && (
              <div className="w-1/2 overflow-auto border-primary border rounded">
                {renderPreview()}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
