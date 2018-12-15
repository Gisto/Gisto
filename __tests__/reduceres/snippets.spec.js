import * as AT from 'constants/actionTypes';
import { snippets as reducer } from 'reducers/snippets';

import { rawSnippets, snippet, snippets } from '../../__mocks__/snippets';
import { filter, head, keyBy, map, merge } from 'lodash/fp';
import { snippetStructure } from 'utils/prepareSnippet';

const initialState = (props) => ({
  snippets: {},
  starred: [],
  filter: {
    text: '',
    tags: [],
    language: '',
    status: '',
    truncated: false,
    untagged: false
  },
  lastOpenedId: null,
  new: {
    description: '',
    public: true,
    tags: [],
    files: []
  },
  edit: {},
  ...props
});

describe('reducer - snippets', () => {
  test('should return initial state', () => {
    const action = {
      type: ''
    };

    expect(reducer(initialState(), action))
      .toEqual(initialState());
  });

  test('should set filter to text', () => {
    const action = {
      type: AT.FILTER_SNIPPETS_BY_TEXT,
      payload: {
        value: 'text'
      }
    };

    const expected = initialState({
      filter: {
        text: 'text',
        tags: [],
        language: '',
        status: '',
        truncated: false,
        untagged: false
      }
    });

    expect(reducer(initialState(), action))
      .toEqual(expected);
  });

  test('should set filter to language', () => {
    const action = {
      type: AT.FILTER_SNIPPETS_BY_LANGUAGE,
      payload: {
        value: 'HTML'
      }
    };

    const expected = initialState({
      filter: {
        text: '',
        tags: [],
        language: 'HTML',
        status: '',
        truncated: false,
        untagged: false
      }
    });

    expect(reducer(initialState(), action))
      .toEqual(expected);
  });

  test('should remove tag from filter', () => {
    const action = {
      type: AT.REMOVE_TAG_FROM_FILTER,
      payload: {
        tag: 'CSS'
      }
    };

    const initial = initialState({
      filter: {
        text: '',
        tags: ['HTML', 'CSS', 'JS'],
        language: '',
        status: '',
        truncated: false,
        untagged: false
      }
    });

    const expected = initialState({
      filter: {
        text: '',
        tags: ['HTML', 'JS'],
        language: '',
        status: '',
        truncated: false,
        untagged: false
      }
    });

    expect(reducer(initial, action)).toEqual(expected);
  });

  test('should clear filters', () => {
    const action = {
      type: AT.CLEAR_FILTERS
    };

    const initial = initialState({
      filter: {
        text: 'html',
        tags: ['HTML', 'CSS', 'JS'],
        language: '',
        status: '',
        truncated: false,
        untagged: false
      }
    });

    const expected = initialState({
      filter: {
        text: '',
        tags: [],
        language: '',
        status: '',
        truncated: false,
        untagged: false
      }
    });

    expect(reducer(initial, action)).toEqual(expected);
  });

  test('should filter snippets by tag', () => {
    const action = {
      type: AT.FILTER_SNIPPETS_BY_TAGS,
      payload: {
        value: 'HTML'
      }
    };

    const expected = initialState({
      filter: {
        text: '',
        tags: ['HTML'],
        language: '',
        status: '',
        truncated: false,
        untagged: false
      }
    });

    expect(reducer(initialState(), action))
      .toEqual(expected);
  });

  test('should filter snippets by tags', () => {
    const action = {
      type: AT.FILTER_SNIPPETS_BY_TAGS,
      payload: {
        value: 'CSS'
      }
    };

    const initial = initialState({
      filter: {
        text: '',
        tags: ['HTML'],
        language: '',
        status: '',
        truncated: false,
        untagged: false
      }
    });

    const expected = initialState({
      filter: {
        text: '',
        tags: ['HTML', 'CSS'],
        language: '',
        status: '',
        truncated: false,
        untagged: false
      }
    });

    expect(reducer(initial, action))
      .toEqual(expected);
  });

  test('should filter snippets by status', () => {
    const action = {
      type: AT.FILTER_SNIPPETS_BY_STATUS,
      payload: {
        status: 'private'
      }
    };

    const initial = initialState({
      filter: {
        text: '',
        tags: [],
        language: '',
        status: '',
        truncated: false,
        untagged: false
      }
    });

    const expected = initialState({
      filter: {
        text: '',
        tags: [],
        language: '',
        status: 'private',
        truncated: false,
        untagged: false
      }
    });

    expect(reducer(initial, action))
      .toEqual(expected);
  });

  test('should filter snippets by truncated', () => {
    const action = {
      type: AT.FILTER_SNIPPETS_BY_TRUNCATED,
      payload: {
        status: 'truncated'
      }
    };

    const initial = initialState({
      filter: {
        text: '',
        tags: [],
        language: '',
        status: '',
        truncated: false,
        untagged: false
      }
    });

    const expected = initialState({
      filter: {
        text: '',
        tags: [],
        language: '',
        status: '',
        truncated: true,
        untagged: false
      }
    });

    expect(reducer(initial, action))
      .toEqual(expected);
  });

  test('should filter snippets by untagged', () => {
    const action = {
      type: AT.FILTER_SNIPPETS_BY_UNTAGGED,
      payload: {
        status: 'untagged'
      }
    };

    const initial = initialState({
      filter: {
        text: '',
        tags: [],
        language: '',
        status: '',
        truncated: false,
        untagged: false
      }
    });

    const expected = initialState({
      filter: {
        text: '',
        tags: [],
        language: '',
        status: '',
        truncated: false,
        untagged: true
      }
    });

    expect(reducer(initial, action))
      .toEqual(expected);
  });

  test('should get snippets', () => {
    const action = {
      type: AT.GET_SNIPPETS.SUCCESS,
      payload: rawSnippets()
    };

    const initial = initialState({ starred: ['bbb123'] });

    const expected = initialState({
      starred: ['bbb123'],
      snippets: merge(keyBy('id', map((snippet) => snippetStructure(snippet, initial.starred), action.payload)), initial.snippets)
    });

    expect(reducer(initial, action))
      .toEqual(expected);
  });

  test('should get starred snippets', () => {
    const action = {
      type: AT.GET_STARRED_SNIPPETS.SUCCESS,
      payload: filter({ id: 'bbb123' }, rawSnippets())
    };

    const initial = initialState();

    const expected = initialState({
      starred: ['bbb123']
    });

    expect(reducer(initial, action))
      .toEqual(expected);
  });

  test('should get snippet', () => {
    const aaa123 = head(JSON.stringify(rawSnippets()));
    const action = {
      type: AT.GET_SNIPPET.SUCCESS,
      payload: aaa123
    };

    const initial = initialState();

    const expected = initialState({
      lastOpenedId: aaa123.id,
      snippets: merge(keyBy('id', map((snippet) => snippetStructure(snippet, initial.starred), action.payload)), initial.snippets)
    });

    expect(reducer(initial, action))
      .toEqual(expected);
  });

  test('should set star', () => {
    const action = {
      type: AT.SET_STAR.SUCCESS,
      meta: {
        id: 'aaa123'
      }
    };

    const initial = initialState({
      starred: ['bbb123']
    });

    const expected = initialState({
      starred: ['aaa123', 'bbb123'],
      snippets: {
        aaa123: {
          star: true
        }
      }
    });

    expect(reducer(initial, action))
      .toEqual(expected);
  });

  test('should unset star', () => {
    const action = {
      type: AT.UNSET_STAR.SUCCESS,
      meta: {
        id: 'aaa123'
      }
    };

    const initial = initialState({
      starred: ['aaa123', 'bbb123']
    });

    const expected = initialState({
      starred: ['bbb123'],
      snippets: {
        aaa123: {
          star: false
        }
      }
    });

    expect(reducer(initial, action))
      .toEqual(expected);
  });

  test.skip('should create snippet', () => {
    const newSnippet = snippet({ id: 'ddd123', description: 'ddd123 #ddd' });
    const action = {
      type: AT.CREATE_SNIPPET.SUCCESS,
      payload: newSnippet
    };

    const initial = initialState({
      snippets: snippets(),
      starred: ['bbb123']
    });

    const expected = initialState({
      snippets: [ ...snippets(), ...snippetStructure(action.payload, initial.starred) ],
      starred: ['bbb123']
    });

    expect(reducer(JSON.stringify(initial), action))
      .toEqual(JSON.stringify(expected));
  });

});
