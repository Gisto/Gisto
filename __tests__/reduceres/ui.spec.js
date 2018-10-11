import * as AT from 'constants/actionTypes';
import { ui as reducer } from 'reducers/ui';

const initialState = {
  snippets: {
    loading: false,
    edit: false
  },
  rateLimit: {}
};

describe('reducer - ui', () => {

  test('should return initial state', () => {
    const action = {
      type: ''
    };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  test('should indicate loading state is true', () => {
    const action = {
      type: AT.GET_SNIPPETS.PENDING
    };
    const expectedResult = {
      snippets: {
        edit: false,
        loading: true,
        comments: false
      },
      rateLimit: {}
    };

    expect(reducer(initialState, action)).toEqual(expectedResult);
  });

  test('should indicate loading state is false', () => {
    const action = {
      type: AT.GET_SNIPPETS.SUCCESS
    };
    const expectedResult = {
      snippets: {
        edit: false,
        loading: false,
        comments: false
      },
      rateLimit: {}
    };

    expect(reducer(initialState, action)).toEqual(expectedResult);
  });

  test('should indicate edit state of snippet true', () => {
    const action = {
      type: AT.START_EDIT_SNIPPET
    };
    const expectedResult = {
      snippets: {
        edit: true,
        loading: false,
        comments: false
      },
      rateLimit: {}
    };

    expect(reducer(initialState, action)).toEqual(expectedResult);
  });

  test('should indicate edit state of snippet false', () => {
    const action = {
      type: AT.UPDATE_SNIPPET.SUCCESS
    };
    const initial = {
      snippets: {
        edit: true,
        loading: false,
        comments: false
      },
      rateLimit: {}
    };
    const expectedResult = {
      snippets: {
        edit: false,
        loading: false,
        comments: false
      },
      rateLimit: {}
    };

    expect(reducer(initial, action)).toEqual(expectedResult);
  });

  test('should indicate stopping edit of snippet', () => {
    const action = {
      type: AT.STOP_EDIT_SNIPPET
    };
    const initial = {
      snippets: {
        edit: true,
        loading: false,
        comments: false
      },
      rateLimit: {}
    };
    const expectedResult = {
      snippets: {
        edit: false,
        loading: false,
        comments: false
      },
      rateLimit: {}
    };

    expect(reducer(initial, action)).toEqual(expectedResult);
  });

  test('should get rate limit', () => {
    const action = {
      type: AT.GET_RATE_LIMIT.SUCCESS,
      payload: {
        "resources": {
          "core": {
            "limit": 5000,
            "remaining": 4999,
            "reset": 1372700873
          },
          "search": {
            "limit": 30,
            "remaining": 18,
            "reset": 1372697452
          }
        },
        "rate": {
          "limit": 5000,
          "remaining": 4999,
          "reset": 1372700873
        }
      }
    };
    const expectedResult = {
      snippets: {
        edit: false,
        loading: false
      },
      rateLimit: {
        "loading": false,
        "rate": {
          "limit": 5000,
          "remaining": 4999,
          "reset": 1372700873
        },
        "resources": {
          "core": {
            "limit": 5000,
            "remaining": 4999,
            "reset": 1372700873
          },
          "search": {
            "limit": 30,
            "remaining": 18,
            "reset": 1372697452
          }
        }
      }
    };

    expect(reducer(initialState, action)).toEqual(expectedResult);
  });

});
