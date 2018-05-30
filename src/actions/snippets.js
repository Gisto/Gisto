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

export const filterSnippets = (value) => ({
  meta: {
    value
  },
  type: AT.FILTER_SNIPPETS,
  payload: { value }
});
