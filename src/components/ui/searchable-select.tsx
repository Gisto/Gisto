'use client';

import { ChevronDown } from 'lucide-react';
import Select, { SelectRenderer } from 'react-dropdown-select';

import { Input } from '@/components/ui/input';
import { t } from '@/lib/i18n';
import { cn } from '@/utils';

export type SearchableSelectOption<T = string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

interface SearchableSelectProps<T> {
  options: SearchableSelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  loading?: boolean;
  itemRenderer?: (
    item: SearchableSelectOption<T>,
    props: SelectRenderer<SearchableSelectOption<T>>
  ) => React.ReactNode;
}

export function SearchableSelect<T>({
  options,
  value,
  onChange,
  placeholder = t('common.select'),
  searchPlaceholder = t('common.search'),
  disabled,
  loading,
  itemRenderer,
}: SearchableSelectProps<T>) {
  return (
    <Select<SearchableSelectOption<T>>
      options={options}
      values={options.filter((o) => o.value === value)}
      onChange={(values) => {
        if (values.length > 0) {
          onChange(values[0].value);
        }
      }}
      placeholder={placeholder}
      searchable
      clearable={false}
      dropdownHandle={false}
      closeOnSelect
      dropdownPosition="auto"
      disabled={disabled}
      loading={loading}
      className="searchable-select"
      color="hsl(var(--primary))"
      contentRenderer={({ state }: SelectRenderer<SearchableSelectOption<T>>) => (
        <div className="flex w-full items-center justify-between gap-2">
          <span
            className={cn('flex-1 truncate text-sm', !state.values[0] && 'text-muted-foreground')}
          >
            {state.values[0]?.label ?? placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      )}
      dropdownRenderer={({ props, state, methods }: SelectRenderer<SearchableSelectOption<T>>) => {
        const regexp = new RegExp(state.search, 'i');
        const { searchBy } = props;

        return (
          <div className="bg-popover text-popover-foreground rounded-md border shadow-md">
            <div className="p-2">
              <Input
                type="search"
                value={state.search}
                autoFocus
                onChange={methods.setSearch}
                placeholder={searchPlaceholder}
                data-search-input
              />
            </div>
            <div className="max-h-60 overflow-y-auto p-1">
              {options
                .filter((item) =>
                  regexp.test(item[searchBy as keyof SearchableSelectOption<T>] as string)
                )
                .map((option) => {
                  if (itemRenderer) {
                    return (
                      <div
                        key={String(option.value)}
                        className={cn(
                          'flex cursor-pointer items-center rounded-sm px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground',
                          state.values[0]?.value === option.value &&
                            'bg-accent text-accent-foreground'
                        )}
                        onClick={
                          option.disabled
                            ? undefined
                            : () => {
                                methods.addItem(option);
                                onChange(option.value);
                              }
                        }
                      >
                        {itemRenderer(option, { props, state, methods } as SelectRenderer<
                          SearchableSelectOption<T>
                        >)}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      disabled={option.disabled}
                      className={cn(
                        'relative flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm transition-colors outline-hidden hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
                        state.values[0]?.value === option.value &&
                          'bg-accent text-accent-foreground'
                      )}
                      onClick={
                        option.disabled
                          ? undefined
                          : () => {
                              methods.addItem(option);
                              onChange(option.value);
                            }
                      }
                    >
                      {option.label}
                    </button>
                  );
                })}
              {options.filter((item) =>
                regexp.test(item[searchBy as keyof SearchableSelectOption<T>] as string)
              ).length === 0 && (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  {t('components.noResults')}
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
