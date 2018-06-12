import { createSelector } from 'reselect';
import {
  filter,
  flattenDeep,
  flow,
  get,
  groupBy,
  head,
  map,
  reverse,
  size,
  sortBy
} from 'lodash/fp';

const getSnippetsFromState = (state) => state.snippets.snippets;
const getStarredSnippetsFromState = (state) => state.snippets.starred;

export const getSnippets = createSelector(
  [getSnippetsFromState],
  (snippets) => snippets
);

export const getStarredCount = createSelector(
  [getStarredSnippetsFromState],
  (snippets) => size(snippets)
);

export const getLanguages = createSelector(
  [getSnippetsFromState],
  (snippets) => {
    const files = map('files', snippets);
    const grouped = groupBy('language', flattenDeep(files));

    const languages = map((language) => ({
      language: get('language', head(language)),
      size: size(language)
    }), grouped);

    return reverse(sortBy('size', languages));
  }
);

export const getPrivate = createSelector(
  [getSnippetsFromState],
  (snippets) => flow([
    filter({ public: false }),
    size
  ])(snippets)
);
