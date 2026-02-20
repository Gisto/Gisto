import { ActionType } from '@/components/layout/pages/create-or-edit-snippet/reducer.ts';
import { toast } from '@/components/toast';
import { languageMimeMap } from '@/constants/language-map.ts';
import { t } from '@/lib/i18n';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const handleFileUpload = (
  file: File,
  dispatch: React.ActionDispatch<[action: ActionType]>,
  defaultLanguage: string
) => {
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
        language: languageMimeMap[file.type]?.toUpperCase() ?? defaultLanguage,
      },
    });
  };

  if (isImage) {
    reader.readAsDataURL(file);
  } else {
    reader.readAsText(file);
  }
};

export const handleMultipleFilesUpload = (
  files: FileList | File[],
  dispatch: React.ActionDispatch<[action: ActionType]>,
  defaultLanguage: string
) => {
  Array.from(files).forEach((file) => {
    handleFileUpload(file, dispatch, defaultLanguage);
  });
};
