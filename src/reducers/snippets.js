import { merge, keyBy, update, set, map } from 'lodash/fp';
import * as AT from 'constants/actionTypes';
import { snippetStructure } from 'utils/prepareSnippet';

const initialState = {
  snippets: {},
  starred: []
};

export const snippets = (state = initialState, action) => {
  switch (action.type) {
    case AT.GET_SNIPPETS.SUCCESS: {
      return update('snippets', () => merge(keyBy('id', map((snippet) => snippetStructure(snippet, state.starred), action.payload)), state.snippets), state);
    }

    case AT.GET_SNIPPET.SUCCESS: {
      return set(['snippets', action.payload.id], snippetStructure(action.payload, state.starred), state);
    }

    case AT.GET_STARRED_SNIPPETS.SUCCESS: {
      return set('starred', map('id', action.payload), state);
    }

    default: {
      return state;
    }
  }
};
