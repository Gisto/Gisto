import Editor from '@monaco-editor/react';
import { Expand } from 'lucide-react';
import { useState } from 'react';

import { Markdown } from '@/components/layout/pages/snippet/content/preview/markdown.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx';
import { EDITOR_OPTIONS } from '@/constants';
import { languageMap } from '@/constants/language-map.ts';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { getEditorTheme } from '@/utils';

type ExpandedEditorProps = {
  content: string;
  onChange: (value: string) => void;
  filename: string;
  language: string;
  index: number;
  isMarkdown: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const ExpandedEditor = ({
  content,
  onChange,
  filename,
  language,
  index,
  isMarkdown,
  onOpenChange,
}: ExpandedEditorProps) => {
  const settings = useStoreValue('settings');
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    onOpenChange?.(isOpen);
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
          <DialogHeader>
            <DialogTitle>{filename || t('pages.new.newFile')}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-1 gap-4 mt-4 min-h-0 w-full overflow-hidden">
            <div className={isMarkdown ? 'w-1/2 min-h-0' : 'w-full min-h-0'}>
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
            {isMarkdown && (
              <div className="w-1/2 overflow-auto border-primary border rounded">
                <Markdown
                  file={{
                    filename,
                    content,
                    language,
                    encoding: '',
                    raw_url: '',
                    size: 0,
                    truncated: false,
                    type: '',
                  }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
