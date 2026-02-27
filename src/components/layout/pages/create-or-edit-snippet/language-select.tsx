import Select, { SelectRenderer } from 'react-dropdown-select';

import { ActionType } from './reducer';

import { Input } from '@/components/ui/input.tsx';
import { languageMap } from '@/constants/language-map.ts';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { cn } from '@/utils';

type SelectOption = {
  label: string;
  value: string;
  fileIndex?: number;
  disabled?: boolean;
};

const customDropdownRenderer = ({ props, state, methods }: SelectRenderer<SelectOption>) => {
  const regexp = new RegExp(state.search, 'i');

  const { options, searchBy } = props;
  const { setSearch, isSelected, addItem } = methods;

  return (
    <div className="bg-background">
      <div className="m-2">
        <Input
          type="search"
          value={state.search}
          autoFocus
          onChange={setSearch}
          placeholder={t('pages.new.findLanguage')}
        />
      </div>
      {options
        .filter((item: SelectOption) => regexp.test(item[searchBy as keyof SelectOption] as string))
        .map((option: SelectOption) => {
          if (!props.keepSelectedInList && isSelected(option)) {
            return null;
          }

          return (
            <button
              key={option.label}
              className={cn('block w-full text-left text-sm rounded hover:bg-primary/10 p-2')}
              onClick={
                option.disabled
                  ? undefined
                  : () => {
                      addItem(option);
                      props.onChange([option]);
                    }
              }
            >
              {option?.label && <div>{option.label}</div>}
            </button>
          );
        })}
    </div>
  );
};

type LanguageSelectProps = {
  index: number;
  fileLanguage: string | undefined;
  dispatch: React.Dispatch<ActionType>;
};

export const LanguageSelect = ({ index, fileLanguage, dispatch }: LanguageSelectProps) => {
  const settings = useStoreValue('settings');

  return (
    <div className="w-full">
      <Select<SelectOption>
        options={[
          ...Object.keys(languageMap).map((language) => ({
            label: language,
            value: languageMap[language],
            fileIndex: index,
          })),
        ]}
        onChange={(val) =>
          dispatch({
            type: 'SET_FILE_LANGUAGE',
            payload: val[0]?.value,
            index,
          })
        }
        color="hsl(var(--primary))"
        contentRenderer={({ state }: SelectRenderer<SelectOption>) => (
          <div className="text-sm">
            {state.values && state.values[0]?.label && state.values[0].label}
          </div>
        )}
        dropdownRenderer={customDropdownRenderer}
        values={
          [
            {
              label: fileLanguage ? fileLanguage : settings.newSnippetDefaultLanguage,
              value: fileLanguage ? languageMap[fileLanguage] : settings.newSnippetDefaultLanguage,
            },
          ] as SelectOption[]
        }
      />
    </div>
  );
};
