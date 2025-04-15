import { Upload } from 'lucide-react';
import { useRef } from 'react';

import { ActionType } from '@/components/layout/pages/create-or-edit-snippet/reducer.ts';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { languageMimeMap } from '@/constants/language-map.ts';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { upperCaseFirst } from '@/lib/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const FileUploadButton = ({
  dispatch,
}: {
  dispatch: React.ActionDispatch<[action: ActionType]>;
}) => {
  const settings = useStoreValue('settings');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const isImage = file.type.startsWith('image/') && !file.type.startsWith('image/svg');

      if (file.size > MAX_FILE_SIZE) {
        toast.error({ message: t('pages.new.fileTooLargeError') });
        return;
      }

      if (isImage) {
        toast.info({ message: t('pages.new.fileWillBeConvertedToBase64') });
      }

      const reader = new FileReader();
      reader.onload = () => {
        dispatch({
          type: 'ADD_FILE',
          payload: {
            filename: file.name,
            content: reader.result as string,
            language:
              languageMimeMap[file.type]?.toUpperCase() ?? settings.newSnippetDefaultLanguage,
          },
        });
      };

      if (isImage) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  return (
    <>
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        <Upload className="size-4" />
        {upperCaseFirst(t('common.upload'))} {t('common.file')}
      </Button>
    </>
  );
};
