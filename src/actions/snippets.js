import * as AT from 'constants/actionTypes';

export const getSnippets = () => ({
  type: AT.GET_SNIPPETS
});

export const getStarredSnippets = () => ({
  type: AT.GET_STARRED_SNIPPETS
});

export const getSnippet = (id) => ({
  meta: {
    id
  },
  type: AT.GET_SNIPPET,
  payload: { id }
});

export const filterSnippetsByText = (value) => ({
  meta: {
    value
  },
  type: AT.FILTER_SNIPPETS_BY_TEXT,
  payload: { value }
});

export const filterSnippetsByTags = (value) => ({
  meta: {
    value
  },
  type: AT.FILTER_SNIPPETS_BY_TAGS,
  payload: { value }
});

export const filterSnippetsByLanguage = (value) => ({
  meta: {
    value
  },
  type: AT.FILTER_SNIPPETS_BY_LANGUAGE,
  payload: { value }
});

export const clearAllFilters = () => ({
  type: AT.CLEAR_FILTERS
});

export const removeTagFromFilter = (tag) => ({
  meta: {
    tag
  },
  type: AT.REMOVE_TAG_FROM_FILTER,
  payload: { tag }
});

export const starSnippet = (id) => ({
  meta: {
    id
  },
  type: AT.SET_STAR,
  payload: { id }
});

export const unStarSnippet = (id) => ({
  meta: {
    id
  },
  type: AT.UNSET_STAR,
  payload: { id }
});
