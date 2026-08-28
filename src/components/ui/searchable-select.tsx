'use client';

import { ChevronDown } from 'lucide-react';
import Select from 'react-dropdown-select';

import type { RendererArgs } from 'react-dropdown-select/types/select-types';

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
  chip?: boolean;
  contentRenderer?: (arg: RendererArgs<SearchableSelectOption<T>>) => React.ReactElement;
  itemRenderer?: (
    item: SearchableSelectOption<T>,
    props: RendererArgs<SearchableSelectOption<T>>
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
  chip,
  contentRenderer,
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
      className={cn('searchable-select', chip && 'searchable-select-chip')}
      color="hsl(var(--primary))"
      contentRenderer={
        contentRenderer ??
        (({ state }: RendererArgs<SearchableSelectOption<T>>) => (
          <div
            className={cn('flex w-full items-center justify-between gap-2', chip && 'h-6! gap-1.5')}
          >
            <span
              className={cn(
                'flex-1 truncate text-sm',
                chip && 'text-xs! font-medium',
                !state.values[0] && 'text-muted-foreground'
              )}
            >
              {state.values[0]?.label ?? placeholder}
            </span>
            <ChevronDown
              className={cn('h-4 w-4 shrink-0 opacity-50', chip && 'size-3! text-muted-foreground')}
            />
          </div>
        ))
      }
      dropdownRenderer={({ props, state, methods }: RendererArgs<SearchableSelectOption<T>>) => {
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
                          'flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground',
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
                        {itemRenderer(option, { props, state, methods } as RendererArgs<
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
                      <span className="min-w-0 flex-1 truncate text-left">{option.label}</span>
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
