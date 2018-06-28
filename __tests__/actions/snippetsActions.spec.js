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
    expect(snippetsActions.getSnippets()).toEqual({ type: AT.GET_SNIPPETS });
  });

  test('getStarredSnippets action should be created', () => {
    expect(snippetsActions.getStarredSnippets()).toEqual({ type: AT.GET_STARRED_SNIPPETS });
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
});
