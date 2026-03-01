import Editor from '@monaco-editor/react';
import { Trash } from 'lucide-react';
import { z } from 'zod';

import { LanguageSelect } from './language-select.tsx';
import { ActionType } from './reducer';

import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { ZodError } from '@/components/zod-error.tsx';
import { EDITOR_OPTIONS } from '@/constants';
import { languageMap } from '@/constants/language-map.ts';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { cn, getEditorTheme } from '@/utils';

type FileCardProps = {
  file: {
    language: string | undefined;
    filename: string | number | readonly string[] | undefined;
    content: string | undefined;
  };
  index: number;
  dispatch: React.Dispatch<ActionType>;
  isEdit: boolean;
  errors: z.ZodIssue[];
  totalFiles: number;
};

export const FileCard = ({ file, index, dispatch, isEdit, errors, totalFiles }: FileCardProps) => {
  const settings = useStoreValue('settings');

  return (
    <Card key={`${index}-${file.language}`} className="hover:border-primary mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className={cn('flex items-center gap-2', file.content === null && 'text-danger')}>
            {file.content === null && <Trash />} {file.filename || t('pages.new.newFile')}{' '}
            {file.content === null && <small>({t('pages.new.willBeDeletedUponUpdate')})</small>}
          </div>
          {totalFiles > 1 && file.content !== null && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (isEdit) {
                  dispatch({ type: 'SET_CONTENT', payload: null, index });
                } else {
                  dispatch({ type: 'REMOVE_FILE', index });
                }
              }}
            >
              <Trash className="size-4" /> {t('pages.new.removeFile')}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      {file.content !== null && (
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-8">
              <label htmlFor="file" className="w-1/2 text-sm font-medium text-primary flex gap-2">
                {t('common.file')} <ZodError errors={errors} path={`files.${index}.filename`} />
              </label>
              <label
                htmlFor="file-language"
                className="w-1/2 text-sm font-medium text-primary flex gap-2"
              >
                {t('pages.new.fileSyntax')} ({t('common.optional').toLowerCase()})
              </label>
            </div>
            <div className="flex items-center gap-6">
              <Input
                type="text"
                id="file"
                value={file.filename}
                onChange={(e) => dispatch({ type: 'SET_FILENAME', payload: e.target.value, index })}
                placeholder={t('pages.new.enterFileName')}
              />
              <LanguageSelect index={index} fileLanguage={file.language} dispatch={dispatch} />
            </div>

            <label htmlFor="file-content" className="text-sm font-medium text-primary flex gap-2">
              {t('pages.new.fileContent')}{' '}
              <ZodError errors={errors} path={`files.${index}.content`} />
            </label>
            <Editor
              value={file.content}
              onChange={(value) => {
                dispatch({ type: 'SET_CONTENT', payload: value || '', index });
              }}
              className="border-primary border rounded p-1"
              options={{
                ...EDITOR_OPTIONS,
                ...settings.editor,
                readOnly: false,
                codeLens: false,
              }}
              height="30vh"
              theme={getEditorTheme()}
              language={languageMap[file?.language ?? settings.newSnippetDefaultLanguage]}
              path={`file-${index}`}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};
