import { ActionType } from './reducer';

import { SearchableSelect } from '@/components/ui/searchable-select.tsx';
import { languageMap } from '@/constants/language-map.ts';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';

type LanguageSelectProps = {
  index: number;
  fileLanguage: string | undefined;
  dispatch: React.Dispatch<ActionType>;
};

export const LanguageSelect = ({ index, fileLanguage, dispatch }: LanguageSelectProps) => {
  const settings = useStoreValue('settings');

  const options = Object.keys(languageMap).map((language) => ({
    label: language,
    value: language,
  }));

  return (
    <div className="w-full">
      <SearchableSelect
        options={options}
        value={fileLanguage || settings.newSnippetDefaultLanguage}
        onChange={(val) =>
          dispatch({
            type: 'SET_FILE_LANGUAGE',
            payload: val,
            index,
          })
        }
        searchPlaceholder={t('pages.new.findLanguage')}
      />
    </div>
  );
};
