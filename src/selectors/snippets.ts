import {
  compact,
  countBy,
  filter,
  flatten,
  flattenDeep,
  flow,
  get,
  groupBy,
  head,
  identity,
  map,
  reverse,
  size,
  sortBy,
  uniq
} from 'lodash/fp';
import { createSelector } from 'reselect';
import { ISnippet, IState } from 'types/Interfaces';
import { mapValuesWithKey } from 'utils/lodash';

const getSnippetsFromState = (state: IState) => state.snippets.snippets;
const getStarredSnippetsFromState = (state: IState) => state.snippets.starred;

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
      map((language: string[]) => ({
        language: get('language', head(language)),
        size: size(language)
      })),
      sortBy('size'),
      reverse
    ])(snippets)
);

const getFlattenedTags = (snippets: ISnippet[]) => flow([map('tags'), flattenDeep, compact])(snippets);

const countUniqueItems = (keyName: string) => (items: ISnippet[]) => flow([
    countBy(identity),
    // tslint:disable-next-line:no-shadowed-variable
    mapValuesWithKey((size: number, item: number) => ({ [keyName]: item, size }))
  ])(items);

export const getTagsWithCounts = createSelector(
  [getSnippetsFromState],
  (snippets) => {
    return flow([getFlattenedTags, countUniqueItems('tag'), sortBy('size'), reverse])(snippets);
  }
);

export const getPrivate = createSelector(
  [getSnippetsFromState],
  (snippets) => flow([filter({ public: false }), size])(snippets)
);

export const getTruncated = createSelector(
  [getSnippetsFromState],
  (snippets) => flow([filter({ truncated: true }), size])(snippets)
);

export const getUntagged = createSelector(
  [getSnippetsFromState],
  (snippets) => flow([filter((snippet: ISnippet) => size(snippet.tags) === 0), size])(snippets)
);

export const getTags = createSelector(
  [getSnippetsFromState],
  (snippets) => flow([
  map('tags'),
  flatten,
  compact,
  uniq
])(snippets)
);
