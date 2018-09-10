import * as AT from 'constants/actionTypes';
import { snippets as reducer } from 'reducers/snippets';

const initialState = (props) => ({
  snippets: {},
  starred: [],
  filter: {
    text: '',
    tags: [],
    language: '',
    status: ''
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
        status: ''
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
        status: ''
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
        status: ''
      }
    });

    const expected = initialState({
      filter: {
        text: '',
        tags: ['HTML', 'JS'],
        language: '',
        status: ''
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
        status: ''
      }
    });

    const expected = initialState({
      filter: {
        text: '',
        tags: [],
        language: '',
        status: ''
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
        status: ''
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
        status: ''
      }
    });

    const expected = initialState({
      filter: {
        text: '',
        tags: ['HTML', 'CSS'],
        language: '',
        status: ''
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
        status: ''
      }
    });

    const expected = initialState({
      filter: {
        text: '',
        tags: [],
        language: '',
        status: 'private'
      }
    });

    expect(reducer(initial, action))
      .toEqual(expected);
  });
});
