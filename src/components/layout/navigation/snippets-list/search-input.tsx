import { Info, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Input } from '@/components/ui/input.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { t } from '@/lib/i18n';
import { snippetService } from '@/lib/providers/snippet-service.ts';
import { globalState, useStoreValue } from '@/lib/store/globalState.ts';
import { SnippetEnrichedType } from '@/types/snippet.ts';
import { cn, getAllLanguages, getAllTags } from '@/utils';

interface SearchInputProps {
  allSnippets: SnippetEnrichedType[];
}

export const SearchInput = ({ allSnippets }: SearchInputProps) => {
  const search = useStoreValue('search');
  const [localSearch, setLocalSearch] = useState(search);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const allTags = useMemo(() => getAllTags(allSnippets), [allSnippets]);
  const allLanguages = useMemo(() => getAllLanguages(allSnippets), [allSnippets]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setLocalSearch(value);

      const cursorPosition = event.target.selectionStart || value.length;
      const textBeforeCursor = value.substring(0, cursorPosition);

      const searchTerms = textBeforeCursor.split(' ');
      const currentTerm = searchTerms[searchTerms.length - 1];

      if (currentTerm.startsWith('tag:')) {
        const tagQuery = currentTerm.slice(4).toLowerCase();
        const suggestions = allTags.filter(
          (tag) => tag.toLowerCase().startsWith(tagQuery) && tag.toLowerCase() !== tagQuery
        );
        setFilteredSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
        setSelectedSuggestionIndex(0);
      } else if (currentTerm.startsWith('lang:')) {
        const langQuery = currentTerm.slice(5).toLowerCase();
        const suggestions = allLanguages.filter(
          (lang) => lang.toLowerCase().startsWith(langQuery) && lang.toLowerCase() !== langQuery
        );
        setFilteredSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
        setSelectedSuggestionIndex(0);
      } else {
        setShowSuggestions(false);
      }
    },
    [allTags, allLanguages]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1
          );
          break;
        case 'Enter':
        case 'Tab':
          event.preventDefault();
          if (filteredSuggestions[selectedSuggestionIndex]) {
            const selectedSuggestion = filteredSuggestions[selectedSuggestionIndex];
            const cursorPosition = event.currentTarget.selectionStart || localSearch.length;
            const textBeforeCursor = localSearch.substring(0, cursorPosition);
            const textAfterCursor = localSearch.substring(cursorPosition);

            const searchTerms = textBeforeCursor.split(' ');
            const currentTerm = searchTerms[searchTerms.length - 1];

            let newTerm;
            if (currentTerm.startsWith('tag:')) {
              newTerm = `tag:${selectedSuggestion}`;
            } else if (currentTerm.startsWith('lang:')) {
              newTerm = `lang:${selectedSuggestion}`;
            } else {
              return;
            }

            searchTerms[searchTerms.length - 1] = newTerm;
            const newSearch = searchTerms.join(' ') + textAfterCursor;
            setLocalSearch(newSearch);
            setShowSuggestions(false);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setShowSuggestions(false);
          break;
      }
    },
    [showSuggestions, filteredSuggestions, selectedSuggestionIndex, localSearch]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      const cursorPosition = localSearch.length;
      const textBeforeCursor = localSearch.substring(0, cursorPosition);
      const searchTerms = textBeforeCursor.split(' ');
      const currentTerm = searchTerms[searchTerms.length - 1];

      let newTerm;
      if (currentTerm.startsWith('tag:')) {
        newTerm = `tag:${suggestion}`;
      } else if (currentTerm.startsWith('lang:')) {
        newTerm = `lang:${suggestion}`;
      } else {
        return;
      }

      searchTerms[searchTerms.length - 1] = newTerm;
      const newSearch = searchTerms.join(' ');
      setLocalSearch(newSearch);
      setShowSuggestions(false);
    },
    [localSearch]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      globalState.setState({ search: localSearch });
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={t('list.searchSnippets', { number: allSnippets.length })}
        className="pl-8 w-full"
        type="search"
        value={localSearch}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={cn(
                'px-3 py-2 cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground',
                index === selectedSuggestionIndex && 'bg-accent text-accent-foreground'
              )}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      {!localSearch && (
        <Tooltip>
          <TooltipTrigger className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground">
            <Info className="size-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent align="start">
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: t('list.searchHelp.title') }}
            />
            <br />
            <div
              className="text-xs mb-2"
              dangerouslySetInnerHTML={{ __html: t('list.searchHelp.description') }}
            />
            <div
              className="text-xs mb-2"
              dangerouslySetInnerHTML={{ __html: t('list.searchHelp.tags') }}
            />
            <div
              className="text-xs mb-2"
              dangerouslySetInnerHTML={{ __html: t('list.searchHelp.language') }}
            />
            {snippetService.capabilities.supportsStars && (
              <div
                className="text-xs mb-2"
                dangerouslySetInnerHTML={{ __html: t('list.searchHelp.stars') }}
              />
            )}
            <div
              className="text-xs mb-2"
              dangerouslySetInnerHTML={{ __html: t('list.searchHelp.visibility') }}
            />
            <div
              className="text-xs mb-2"
              dangerouslySetInnerHTML={{ __html: t('list.searchHelp.untagged') }}
            />
            <Separator className="mt-4 mb-2" />
            <div className="flex gap-2 items-center">{t('list.searchHelp.tip')}</div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
