import * as AT from 'constants/actionTypes';

export const getRateLimit = () => ({
  type: AT.GET_RATE_LIMIT
});

export const getSnippets = (since: string) => ({
  type: AT.GET_SNIPPETS,
  payload: { since }
});

export const getStarredSnippets = (since: string) => ({
  type: AT.GET_STARRED_SNIPPETS,
  payload: { since }
});

export const getSnippet = (id: string) => ({
  meta: {
    id
  },
  type: AT.GET_SNIPPET,
  payload: { id }
});

export const filterSnippetsByText = (value: string) => ({
  meta: {
    value
  },
  type: AT.FILTER_SNIPPETS_BY_TEXT,
  payload: { value }
});

export const filterSnippetsByTags = (value: string) => ({
  meta: {
    value
  },
  type: AT.FILTER_SNIPPETS_BY_TAGS,
  payload: { value }
});

export const filterSnippetsByLanguage = (value: string) => ({
  meta: {
    value
  },
  type: AT.FILTER_SNIPPETS_BY_LANGUAGE,
  payload: { value }
});

export const filterSnippetsByStatus = (status: string) => ({
  meta: {
    status
  },
  type: AT.FILTER_SNIPPETS_BY_STATUS,
  payload: { status }
});

export const filterSnippetsByTruncated = () => ({
  type: AT.FILTER_SNIPPETS_BY_TRUNCATED
});

export const filterSnippetsByUntagged = () => ({
  type: AT.FILTER_SNIPPETS_BY_UNTAGGED
});

export const clearAllFilters = () => ({
  type: AT.CLEAR_FILTERS
});

export const removeTagFromFilter = (tag: string) => ({
  meta: {
    tag
  },
  type: AT.REMOVE_TAG_FROM_FILTER,
  payload: { tag }
});

export const starSnippet = (id: string) => ({
  meta: {
    id
  },
  type: AT.SET_STAR,
  payload: { id }
});

export const unStarSnippet = (id: string) => ({
  meta: {
    id
  },
  type: AT.UNSET_STAR,
  payload: { id }
});

export const createSnippet = ({
  description,
  files,
  isPublic
}: {
  description: string;
  files: string[];
  isPublic: boolean;
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

export const deleteSnippet = (id: string) => ({
  meta: {
    id
  },
  type: AT.DELETE_SNIPPET,
  payload: { id }
});

export const editSnippet = (id: string) => ({
  meta: {
    id
  },
  type: AT.START_EDIT_SNIPPET,
  payload: { id }
});

export const cancelEditSnippet = () => ({
  type: AT.STOP_EDIT_SNIPPET
});

export const updateTempSnippet = (path: string, value: string) => ({
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

export const deleteTempFile = (uuid: string) => ({
  meta: {
    uuid
  },
  type: AT.DELETE_TEMP_FILE,
  payload: {
    uuid
  }
});

export const addTempFile = (fileName: string, fileContent: string) => ({
  type: AT.ADD_TEMP_FILE,
  payload: {
    fileName,
    fileContent
  }
});

export const updateSnippet = (snippet: object, id: string) => ({
  meta: {
    snippet,
    id
  },
  type: AT.UPDATE_SNIPPET,
  payload: { snippet, id }
});

export const getSnippetComments = (id: string) => ({
  meta: {
    id
  },
  type: AT.GET_SNIPPET_COMMENTS,
  payload: { id }
});

export const createSnippetComment = (id: string, body: string) => ({
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

export const deleteComment = (id: string, commentId: string) => ({
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

export const toggleCollapse = (snippetId: string, fileName: string) => ({
  type: AT.TOGGLE_FILE_COLLAPSE,
  payload: {
    snippetId,
    fileName
  }
});
