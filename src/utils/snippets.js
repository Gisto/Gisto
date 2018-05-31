import { filter, includes, startsWith, trim } from 'lodash/fp';

const filterByFreeText = (snippets, filterText) => {
  const regex = new RegExp(filterText, 'gi');

  return filter((snippet) => snippet.description.match(regex), snippets);
};

const filterByTags = (snippets, filterText) =>
  filter((snippet) => includes(filterText, snippet.tags), snippets);

export const isTag = (filterText) => startsWith('#', filterText);

export const filterSnippetsList = (snippets, filterText) => {
  const searchString = trim(filterText);
  
  if (searchString !== '') {
    if (isTag(searchString)) {
      return filterByTags(snippets, searchString);
    }

    return filterByFreeText(snippets, searchString);
  }

  return snippets;
};
