import { GistEnrichedType } from '@/types/gist.ts';

export const searchFilter = (search: string, currentSnippets: GistEnrichedType[] | []) => {
  if (search === '' || search.length === 0) {
    return currentSnippets;
  }

  const searchTerms = search.toLowerCase().split(' ');

  return currentSnippets.filter((listItem) => {
    return searchTerms.every((term) => {
      if (term.startsWith('tag:')) {
        const tagToSearch = term.slice(4).trim();
        return listItem.tags.some((tag) =>
          tag.replace('#', '').toLowerCase().startsWith(tagToSearch)
        );
      }

      if (term.startsWith('lang:')) {
        const langToSearch = term.slice(5).trim();
        return listItem.languages.some((lang) => lang.name.toLowerCase().startsWith(langToSearch));
      }

      if (term === 'is:starred') {
        return listItem.starred;
      }

      if (term === 'is:unstarred') {
        return !listItem.starred;
      }

      if (term === 'is:untagged') {
        return listItem.tags.length === 0;
      }

      if (term === 'is:private') {
        return !listItem.isPublic;
      }

      if (term === 'is:public') {
        return listItem.isPublic;
      }

      if (listItem.title.trim().toLowerCase().includes(term)) {
        return true;
      }

      return listItem.files.some((file) => file.text?.toLowerCase().includes(term));
    });
  });
};
