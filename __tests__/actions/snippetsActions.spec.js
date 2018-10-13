import * as AT from 'constants/actionTypes';
import * as snippetsActions from 'actions/snippets';

const files = {
  'hi.txt': {
    name: 'hi.txt',
    content: 'hello all'
  }
};

describe('ACTIONS - snippets', () => {
  test('getRateLimit action should be created', () => {
    expect(snippetsActions.getRateLimit()).toEqual({ type: AT.GET_RATE_LIMIT });
  });

  test('getSnippets action should be created', () => {
    expect(snippetsActions.getSnippets()).toEqual({ type: AT.GET_SNIPPETS, payload: { since: undefined  } });
  });

  test('getStarredSnippets action should be created', () => {
    expect(snippetsActions.getStarredSnippets()).toEqual({ type: AT.GET_STARRED_SNIPPETS, payload: { since: undefined  } });
  });

  test('getSnippet action should be created', () => {
    expect(snippetsActions.getSnippet('id123id123')).toEqual({
      meta: {
        id: 'id123id123'
      },
      type: AT.GET_SNIPPET,
      payload: { id: 'id123id123' }
    });
  });

  test('filterSnippetsByText action should be created', () => {
    expect(snippetsActions.filterSnippetsByText('some text')).toEqual({
      meta: {
        value: 'some text'
      },
      type: AT.FILTER_SNIPPETS_BY_TEXT,
      payload: { value: 'some text' }
    });
  });

  test('filterSnippetsByTags action should be created', () => {
    expect(snippetsActions.filterSnippetsByTags('#tag')).toEqual({
      meta: {
        value: '#tag'
      },
      type: AT.FILTER_SNIPPETS_BY_TAGS,
      payload: { value: '#tag' }
    });
  });

  test('filterSnippetsByLanguage action should be created', () => {
    expect(snippetsActions.filterSnippetsByLanguage('HTML')).toEqual({
      meta: {
        value: 'HTML'
      },
      type: AT.FILTER_SNIPPETS_BY_LANGUAGE,
      payload: { value: 'HTML' }
    });
  });

  test('filterSnippetsByStatus action should be created', () => {
    expect(snippetsActions.filterSnippetsByStatus('private')).toEqual({
      meta: {
        status: 'private'
      },
      type: AT.FILTER_SNIPPETS_BY_STATUS,
      payload: { status: 'private' }
    });
  });

  test('filterSnippetsByTruncated action should be created', () => {
    expect(snippetsActions.filterSnippetsByTruncated()).toEqual({ type: AT.FILTER_SNIPPETS_BY_TRUNCATED });
  });

  test('filterSnippetsByUntagged action should be created', () => {
    expect(snippetsActions.filterSnippetsByUntagged()).toEqual({ type: AT.FILTER_SNIPPETS_BY_UNTAGGED });
  });

  test('clearAllFilters action should be created', () => {
    expect(snippetsActions.clearAllFilters()).toEqual({ type: AT.CLEAR_FILTERS });
  });

  test('removeTagFromFilter action should be created', () => {
    expect(snippetsActions.removeTagFromFilter('#tag2')).toEqual({
      meta: {
        tag: '#tag2'
      },
      type: AT.REMOVE_TAG_FROM_FILTER,
      payload: { tag: '#tag2' }
    });
  });

  test('starSnippet action should be created', () => {
    expect(snippetsActions.starSnippet('id123id123')).toEqual({
      meta: {
        id: 'id123id123'
      },
      type: AT.SET_STAR,
      payload: { id: 'id123id123' }
    });
  });

  test('unStarSnippet action should be created', () => {
    expect(snippetsActions.unStarSnippet('id123id123')).toEqual({
      meta: {
        id: 'id123id123'
      },
      type: AT.UNSET_STAR,
      payload: { id: 'id123id123' }
    });
  });

  test('createSnippet (private) action should be created', () => {
    expect(snippetsActions.createSnippet({
      description: 'hello',
      files,
      isPublic: false
    })).toEqual({
      meta: {
        description: 'hello',
        files,
        public: false
      },
      type: AT.CREATE_SNIPPET,
      payload: {
        description: 'hello',
        files,
        public: false
      }
    });
  });

  test('createSnippet (public) action should be created', () => {
    expect(snippetsActions.createSnippet({
      description: 'hello',
      files,
      isPublic: true
    })).toEqual({
      meta: {
        description: 'hello',
        files,
        public: true
      },
      type: AT.CREATE_SNIPPET,
      payload: {
        description: 'hello',
        files,
        public: true
      }
    });
  });

  test('deleteSnippet action should be created', () => {
    expect(snippetsActions.deleteSnippet('id123id123')).toEqual({
      meta: {
        id: 'id123id123'
      },
      type: AT.DELETE_SNIPPET,
      payload: { id: 'id123id123' }
    });
  });

  test('editSnippet action should be created', () => {
    expect(snippetsActions.editSnippet('id123id123')).toEqual({
      meta: {
        id: 'id123id123'
      },
      type: AT.START_EDIT_SNIPPET,
      payload: { id: 'id123id123' }
    });
  });

  test('cancelEditSnippet action should be created', () => {
    expect(snippetsActions.cancelEditSnippet()).toEqual({
      type: AT.STOP_EDIT_SNIPPET
    });
  });

  test('deleteTempFile action should be created', () => {
    expect(snippetsActions.deleteTempFile('id123id123')).toEqual({
      meta: {
        uuid: 'id123id123'
      },
      type: AT.DELETE_TEMP_FILE,
      payload: { uuid: 'id123id123' }
    });
  });

  test('updateTempSnippet action should be created', () => {
    expect(snippetsActions.updateTempSnippet('snippet.name', 'name here')).toEqual({
      meta: {
        path: 'snippet.name',
        value: 'name here'
      },
      type: AT.UPDATE_TEMP_SNIPPET,
      payload: {
        path: 'snippet.name',
        value: 'name here'
      }
    });
  });

  test('updateSnippet action should be created', () => {
    expect(snippetsActions.updateSnippet({
      description: 'hello',
      files: {
        'hi.txt': {
          filename: 'hi.txt',
          content: 'hello all hi hi'
        }
      }
    }, 'id123id123')).toEqual({
      meta: {
        snippet: {
          description: 'hello',
          files: {
            'hi.txt': {
              filename: 'hi.txt',
              content: 'hello all hi hi'
            }
          }
        },
        id: 'id123id123'
      },
      type: AT.UPDATE_SNIPPET,
      payload: {
        snippet: {
          description: 'hello',
          files: {
            'hi.txt': {
              filename: 'hi.txt',
              content: 'hello all hi hi'
            }
          }
        },
        id: 'id123id123' 
      }
    });
  });

  test('addTempFile action should be created', () => {
    expect(snippetsActions.addTempFile('a', 'b')).toEqual({
      type: AT.ADD_TEMP_FILE,
      payload: {
        fileContent: "b",
        fileName: "a",
      }});
  });
});

test('filterSnippetsByStatus action should be created', () => {
  expect(snippetsActions.toggleCollapse('123123', 'file.txt')).toEqual({
    type: AT.TOGGLE_FILE_COLLAPSE,
    payload: {
      snippetId: '123123',
      fileName: 'file.txt'
    }
  });
});

test('getSnippetComments action should be created', () => {
  expect(snippetsActions.getSnippetComments('123123')).toEqual({
    meta: {
      id: '123123'
    },
    type: AT.GET_SNIPPET_COMMENTS,
    payload: {
      id: '123123'
    }
  });
});

test('createSnippetComment action should be created', () => {
  expect(snippetsActions.createSnippetComment('123123', 'hi')).toEqual({
    meta: {
      id: '123123',
      body: 'hi'
    },
    type: AT.CREATE_SNIPPET_COMMENT,
    payload: {
      id: '123123',
      body: 'hi'
    }
  });
});

test('deleteComment action should be created', () => {
  expect(snippetsActions.deleteComment('123123', '234234')).toEqual({
    meta: {
      id: '123123',
      commentId: '234234'
    },
    type: AT.DELETE_COMMENT,
    payload: {
      id: '123123',
      commentId: '234234'
    }
  });
});

test('toggleSnippetComments action should be created', () => {
  expect(snippetsActions.toggleSnippetComments()).toEqual({ type: AT.TOGGLE_SNIPPET_COMMENTS });
});
