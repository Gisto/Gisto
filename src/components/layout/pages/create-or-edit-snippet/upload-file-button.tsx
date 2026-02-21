import { Upload } from 'lucide-react';
import { useRef } from 'react';

import { ActionType } from '@/components/layout/pages/create-or-edit-snippet/reducer.ts';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { upperCaseFirst } from '@/utils';
import { handleFileUpload } from '@/utils/file-upload.ts';

export const FileUploadButton = ({
  dispatch,
}: {
  dispatch: React.ActionDispatch<[action: ActionType]>;
}) => {
  const settings = useStoreValue('settings');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, dispatch, settings.newSnippetDefaultLanguage);
    }
  };

  return (
    <>
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileInputChange} />
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        <Upload className="size-4" />
        {upperCaseFirst(t('common.upload'))} {t('common.file')}
      </Button>
    </>
  );
};
