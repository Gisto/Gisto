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
  sortBy,
  compact,
  countBy,
  identity
} from 'lodash/fp';
import { mapValuesWithKey } from 'utils/lodash';

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

export const getLanguagesWithCounts = createSelector(
  [getSnippetsFromState],
  (snippets) => flow([
    map('files'),
    flattenDeep,
    groupBy('language'),
    map((language) => ({
      language: get('language', head(language)),
      size: size(language)
    })),
    sortBy('size'),
    reverse
  ])(snippets)
);

const getFlattenedTags = (snippets) => flow([
  map('tags'),
  flattenDeep,
  compact
])(snippets);

const countUniqueItems = (keyName) => (items) => flow([
  countBy(identity),
  // eslint-disable-next-line no-shadow
  mapValuesWithKey((size, item) => ({ [keyName]: item, size }))
])(items);

export const getTagsWithCounts = createSelector(
  [getSnippetsFromState],
  (snippets) => {
    return flow([
      getFlattenedTags,
      countUniqueItems('tag'),
      sortBy('size'),
      reverse
    ])(snippets);
  }
);

export const getPrivate = createSelector(
  [getSnippetsFromState],
  (snippets) => flow([
    filter({ public: false }),
    size
  ])(snippets)
);

export const getTruncated = createSelector(
  [getSnippetsFromState],
  (snippets) => flow([
    filter({ truncated: true }),
    size
  ])(snippets)
);

export const getUntagged = createSelector(
  [getSnippetsFromState],
  (snippets) => flow([
    filter((snippet) => size(snippet.tags) === 0),
    size
  ])(snippets)
);
