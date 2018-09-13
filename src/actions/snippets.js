import * as AT from 'constants/actionTypes';

export const getRateLimit = () => ({
  type: AT.GET_RATE_LIMIT
});

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

export const filterSnippetsByStatus = (status) => ({
  meta: {
    status
  },
  type: AT.FILTER_SNIPPETS_BY_STATUS,
  payload: { status }
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

export const createSnippet = ({
  description, files, isPublic
}) => ({
  meta: {
    description,
    public: isPublic,
    files
  },
  type: AT.CREATE_SNIPPET,
  payload: {
    description,
    public: isPublic,
    files
  }
});

export const deleteSnippet = (id) => ({
  meta: {
    id
  },
  type: AT.DELETE_SNIPPET,
  payload: { id }
});

export const editSnippet = (id) => ({
  meta: {
    id
  },
  type: AT.START_EDIT_SNIPPET,
  payload: { id }
});

export const cancelEditSnippet = () => ({
  type: AT.STOP_EDIT_SNIPPET
});

export const updateTempSnippet = (path, value) => ({
  meta: {
    path,
    value
  },
  type: AT.UPDATE_TEMP_SNIPPET,
  payload: {
    path,
    value
  }
});

export const deleteTempFile = (uuid) => ({
  meta: {
    uuid
  },
  type: AT.DELETE_TEMP_FILE,
  payload: {
    uuid
  }
});

export const addTempFile = () => ({
  type: AT.ADD_TEMP_FILE
});

export const updateSnippet = (snippet, id) => ({
  meta: {
    snippet,
    id
  },
  type: AT.UPDATE_SNIPPET,
  payload: { snippet, id }
});

export const getSnippetComments = (id) => ({
  meta: {
    id
  },
  type: AT.GET_SNIPPET_COMMENTS,
  payload: { id }
});

export const createSnippetComment = (id, body) => ({
  meta: {
    id,
    body
  },
  type: AT.CREATE_SNIPPET_COMMENT,
  payload: {
    id,
    body
  }
});

export const deleteComment = (id, commentId) => ({
  meta: {
    id,
    commentId
  },
  type: AT.DELETE_COMMENT,
  payload: {
    id,
    commentId
  }
});

export const toggleSnippetComments = () => ({
  type: AT.TOGGLE_SNIPPET_COMMENTS
});

export const toggleCollapse = (snippetId, fileName) => ({
  type: AT.TOGGLE_FILE_COLLAPSE,
  payload: {
    snippetId,
    fileName
  }
});
