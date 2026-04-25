'use client';

import { Funnel, Tag, Languages } from 'lucide-react';
import { useState } from 'react';

import { AllLanguages } from '@/components/all-languages.tsx';
import { AllTags } from '@/components/all-tags.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { t } from '@/lib/i18n';
import { globalState, useStoreValue } from '@/lib/store/globalState.ts';

export const FilterDropdown = () => {
  const search = useStoreValue('search');
  const [open, setOpen] = useState(false);

  const activeTags = search
    ? search.match(/tag:(\S+)/g)?.map((m) => m.replace('tag:', '')) || []
    : [];
  const activeLanguages = search
    ? search.match(/lang:(\S+)/g)?.map((m) => m.replace('lang:', '')) || []
    : [];
  const hasActiveFilters = activeTags.length > 0 || activeLanguages.length > 0;

  const handleAddTag = (tag: string) => {
    const newSearch = search
      ? `${search} tag:${tag.replace('#', '')}`
      : `tag:${tag.replace('#', '')}`;
    const settings = globalState.getState().settings;
    globalState.setState({
      search: newSearch,
      settings: { ...settings, sidebarViewMode: 'list' },
    });
  };

  const handleAddLanguage = (lang: string) => {
    const newSearch = search ? `${search} lang:${lang}` : `lang:${lang}`;
    const settings = globalState.getState().settings;
    globalState.setState({
      search: newSearch,
      settings: { ...settings, sidebarViewMode: 'list' },
    });
  };

  const handleRemoveTag = (tag: string) => {
    const newSearch = search.replace(new RegExp(`tag:${tag}\\b/?\\s*`), '').trim();
    const settings = globalState.getState().settings;
    globalState.setState({
      search: newSearch,
      settings: { ...settings, sidebarViewMode: 'list' },
    });
  };

  const handleRemoveLanguage = (lang: string) => {
    const newSearch = search.replace(new RegExp(`lang:${lang}\\b/?\\s*`), '').trim();
    const settings = globalState.getState().settings;
    globalState.setState({
      search: newSearch,
      settings: { ...settings, sidebarViewMode: 'list' },
    });
  };

  const clearAllFilters = () => {
    const terms = search
      .split(' ')
      .filter((term) => !term.startsWith('tag:') && !term.startsWith('lang:'));
    const settings = globalState.getState().settings;
    globalState.setState({
      search: terms.join(' ').trim(),
      settings: { ...settings, sidebarViewMode: 'list' },
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Funnel className="size-4" />
          {hasActiveFilters && (
            <span className="border-background absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 bg-primary">
              <span className="sr-only">Active</span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-100">
        <div className="p-2">
          {activeTags.length > 0 && (
            <div className="mb-2">
              <div className="text-xs text-muted-foreground mb-1">{t('common.activeFilters')}</div>
              <div className="flex flex-wrap gap-1">
                {activeTags.map((tag) => (
                  <Button
                    key={tag}
                    variant="secondary"
                    size="sm"
                    className="h-5 text-xs"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {activeLanguages.length > 0 && (
            <div className="mb-2">
              <div className="flex flex-wrap gap-1">
                {activeLanguages.map((lang) => (
                  <Button
                    key={lang}
                    variant="secondary"
                    size="sm"
                    className="h-5 text-xs"
                    onClick={() => handleRemoveLanguage(lang)}
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <Tabs defaultValue="tags">
            <TabsList variant="line" className="w-full">
              <TabsTrigger value="tags" className="flex-1">
                <Tag className="size-3 mr-1" />
                {t('common.tags')}
              </TabsTrigger>
              <TabsTrigger value="languages" className="flex-1">
                <Languages className="size-3 mr-1" />
                {t('common.languages')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tags" className="mt-0">
              <ScrollArea className="h-[50vh]">
                <AllTags onClick={handleAddTag} className="border-0" />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="languages" className="mt-0">
              <ScrollArea className="h-[50vh]">
                <AllLanguages onClick={handleAddLanguage} className="border-0" />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        {hasActiveFilters && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearAllFilters} className="cursor-pointer">
              {t('list.clearAllFilters')}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
